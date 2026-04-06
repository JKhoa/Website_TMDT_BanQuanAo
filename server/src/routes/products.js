import { Router } from 'express';
import { Op } from 'sequelize';
import { Product, Review, Category } from '../models/index.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validateProduct, validateReview } from '../middleware/validate.js';
import logger from '../utils/logger.js';

const router = Router();

// GET /api/products - public, with filter/sort/pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 12, category, subcategory, search,
      sort = 'newest', minPrice, maxPrice, sale, brand
    } = req.query;

    const where = { is_active: true };

    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (brand) where.brand = brand;
    if (sale === 'true') where.sale_price = { [Op.not]: null };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (minPrice || maxPrice) {
      const priceCondition = {};
      if (minPrice) priceCondition[Op.gte] = parseInt(minPrice);
      if (maxPrice) priceCondition[Op.lte] = parseInt(maxPrice);
      where.price = priceCondition;
    }

    const order = {
      'newest': [['created_at', 'DESC']],
      'price-asc': [['price', 'ASC']],
      'price-desc': [['price', 'DESC']],
      'rating': [['rating', 'DESC']],
      'bestseller': [['is_best_seller', 'DESC'], ['review_count', 'DESC']]
    }[sort] || [['created_at', 'DESC']];

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Product.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset,
    });

    res.json({
      products: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['id', 'ASC']] });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review, as: 'reviews', order: [['created_at', 'DESC']] }]
    });
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    res.json({ product });
  } catch (error) {
    logger.error('Get product error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/products - admin only
router.post('/', authenticate, requireAdmin, validateProduct, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    logger.info(`Product created: ${product.name} (${product.sku})`);
    res.status(201).json({ success: true, product, message: 'Thêm sản phẩm thành công' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'SKU đã tồn tại' });
    }
    logger.error('Create product error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// PUT /api/products/:id - admin only
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    await product.update(req.body);
    logger.info(`Product updated: ${product.name}`);
    res.json({ success: true, product, message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    logger.error('Update product error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// DELETE /api/products/:id - admin only (soft delete)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    await product.update({ is_active: false });
    logger.info(`Product deactivated: ${product.name}`);
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    logger.error('Delete product error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/products/:id/reviews - authenticated users
router.post('/:id/reviews', authenticate, validateReview, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    const existingReview = await Review.findOne({
      where: { product_id: product.id, user_id: req.user.id }
    });
    if (existingReview) {
      return res.status(400).json({ error: 'Bạn đã đánh giá sản phẩm này rồi' });
    }

    const review = await Review.create({
      product_id: product.id,
      user_id: req.user.id,
      user_name: req.user.name,
      rating: req.body.rating,
      comment: req.body.comment
    });

    // Update product rating
    const allReviews = await Review.findAll({ where: { product_id: product.id } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await product.update({ rating: Math.round(avgRating * 10) / 10, review_count: allReviews.length });

    res.status(201).json({ success: true, review, message: 'Đánh giá thành công' });
  } catch (error) {
    logger.error('Create review error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
