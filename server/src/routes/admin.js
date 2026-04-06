import { Router } from 'express';
import { Op, fn, col, literal } from 'sequelize';
import { Order, OrderItem, Product, User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

// GET /api/admin/dashboard - summary stats
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const totalRevenue = await Order.sum('total', {
      where: { status: { [Op.not]: 'cancelled' } }
    }) || 0;

    const totalOrders = await Order.count();
    const totalProducts = await Product.count({ where: { is_active: true } });
    const totalCustomers = await User.count({ where: { role: 'customer' } });

    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const completedOrders = await Order.count({ where: { status: 'completed' } });

    // Recent orders
    const recentOrders = await Order.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Low stock products
    const lowStockProducts = await Product.findAll({
      where: { stock: { [Op.lt]: 10 }, is_active: true },
      order: [['stock', 'ASC']],
      limit: 5
    });

    res.json({
      stats: {
        totalRevenue: Number(totalRevenue),
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        completedOrders,
        conversionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
      },
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/admin/revenue?period=daily|monthly&months=6
router.get('/revenue', authenticate, requireAdmin, async (req, res) => {
  try {
    const { period = 'daily', months = 6 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const orders = await Order.findAll({
      where: {
        status: { [Op.not]: 'cancelled' },
        createdAt: { [Op.gte]: startDate }
      },
      attributes: ['total', 'createdAt'],
      order: [['createdAt', 'ASC']]
    });

    // Group by date
    const revenueMap = {};
    const orderCountMap = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      let key;
      if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = date.toISOString().split('T')[0];
      }
      revenueMap[key] = (revenueMap[key] || 0) + Number(order.total);
      orderCountMap[key] = (orderCountMap[key] || 0) + 1;
    });

    const data = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
      orders: orderCountMap[date] || 0
    }));

    res.json({ data });
  } catch (error) {
    console.error('Revenue error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/admin/top-products
router.get('/top-products', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await OrderItem.findAll({
      attributes: [
        'product_id',
        'product_name',
        [fn('SUM', col('quantity')), 'total_sold'],
        [fn('SUM', literal('price * quantity')), 'total_revenue']
      ],
      include: [{
        model: Order,
        attributes: [],
        where: { status: { [Op.not]: 'cancelled' } }
      }],
      group: ['product_id', 'product_name'],
      order: [[literal('total_sold'), 'DESC']],
      limit: parseInt(limit),
      raw: true
    });

    res.json({ products: topProducts });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/admin/customers
router.get('/customers', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const where = { role: 'customer' };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash', 'refresh_token', 'verification_token', 'reset_token'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      customers: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Customers error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
