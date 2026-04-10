import { Router } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { Order, OrderItem, Product, User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validateOrder } from '../middleware/validate.js';
import logger from '../utils/logger.js';
import { sendOrderConfirmation, sendAdminOrderNotification } from '../services/emailService.js';

const router = Router();

// POST /api/orders - create order
router.post('/', authenticate, validateOrder, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, shipping_name, shipping_phone, shipping_address,
      shipping_city, shipping_district, shipping_ward,
      payment_method, shipping_method, notes } = req.body;

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product || !product.is_active) {
        await t.rollback();
        return res.status(400).json({ error: `Sản phẩm "${item.product_name || item.product_id}" không tồn tại` });
      }
      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          error: `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm`
        });
      }

      const price = product.sale_price || product.price;
      subtotal += price * item.quantity;

      // Deduct stock
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction: t }
      );

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        quantity: item.quantity,
        price,
        size: item.size || '',
        color: item.color || ''
      });
    }

    const shippingFee = shipping_method === 'express' ? 50000 : (subtotal > 500000 ? 0 : 30000);
    const total = subtotal + shippingFee;

    const order = await Order.create({
      user_id: req.user.id,
      subtotal,
      shipping_fee: shippingFee,
      total,
      status: 'pending',
      payment_method: payment_method || 'cod',
      shipping_method: shipping_method || 'standard',
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city: shipping_city || '',
      shipping_district: shipping_district || '',
      shipping_ward: shipping_ward || '',
      notes: notes || ''
    }, { transaction: t });

    for (const item of orderItems) {
      await OrderItem.create({ ...item, order_id: order.id }, { transaction: t });
    }

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    logger.info(`Order created: #${order.id} by user ${req.user.email}, total: ${total}`);

    // Send email notifications (fire-and-forget, don't block response)
    sendOrderConfirmation(fullOrder, req.user).catch((err) => {
      logger.warn('Failed to send order confirmation email:', err.message);
    });
    sendAdminOrderNotification(fullOrder).catch((err) => {
      logger.warn('Failed to send admin order notification:', err.message);
    });

    res.status(201).json({
      success: true,
      order: fullOrder,
      message: 'Đặt hàng thành công!'
    });
  } catch (error) {
    await t.rollback();
    logger.error('Create order error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/orders - list orders (admin: all, customer: own)
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = {};

    if (req.user.role !== 'admin') {
      where.user_id = req.user.id;
    }
    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      orders: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }

    // Customer can only see their own orders
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Bạn không có quyền xem đơn hàng này' });
    }

    res.json({ order });
  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// PUT /api/orders/:id/status - admin only
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    if (!order) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }

    // If cancelling, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findByPk(item.product_id);
        if (product) {
          await product.update({ stock: product.stock + item.quantity });
        }
      }
    }

    await order.update({ status });
    logger.info(`Order #${order.id} status updated to ${status}`);

    res.json({ success: true, order, message: `Cập nhật trạng thái thành ${status}` });
  } catch (error) {
    logger.error('Update order status error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// PUT /api/orders/:id/cancel - customer cancel own order
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }

    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Bạn không có quyền hủy đơn hàng này' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Không thể hủy đơn hàng ở trạng thái này' });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.product_id);
      if (product) {
        await product.update({ stock: product.stock + item.quantity });
      }
    }

    await order.update({ status: 'cancelled' });
    logger.info(`Order #${order.id} cancelled by user ${req.user.email}`);

    res.json({ success: true, message: 'Hủy đơn hàng thành công' });
  } catch (error) {
    logger.error('Cancel order error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
