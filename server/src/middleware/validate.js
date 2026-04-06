import { body, param, query, validationResult } from 'express-validator';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dữ liệu không hợp lệ',
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

export const validateRegister = [
  body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('name').trim().notEmpty().withMessage('Tên không được để trống').escape(),
  handleValidation
];

export const validateLogin = [
  body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
  handleValidation
];

export const validateProduct = [
  body('name').trim().notEmpty().withMessage('Tên sản phẩm không được để trống'),
  body('price').isNumeric().withMessage('Giá phải là số').custom(v => v > 0).withMessage('Giá phải > 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Số lượng phải >= 0'),
  handleValidation
];

export const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  body('items.*.product_id').isInt().withMessage('ID sản phẩm không hợp lệ'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Số lượng phải >= 1'),
  body('shipping_name').trim().notEmpty().withMessage('Tên người nhận không được để trống'),
  body('shipping_phone').trim().notEmpty().withMessage('SĐT không được để trống'),
  body('shipping_address').trim().notEmpty().withMessage('Địa chỉ không được để trống'),
  handleValidation
];

export const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Đánh giá từ 1-5 sao'),
  body('comment').trim().notEmpty().withMessage('Nội dung đánh giá không được để trống').escape(),
  handleValidation
];

export const validateUpdateProfile = [
  body('name').optional().trim().notEmpty().withMessage('Tên không được để trống').escape(),
  body('phone').optional().trim().escape(),
  body('gender').optional().escape(),
  handleValidation
];
