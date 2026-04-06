import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { validateRegister, validateLogin, validateUpdateProfile } from '../middleware/validate.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import logger from '../utils/logger.js';

const router = Router();

// POST /api/auth/register
router.post('/register', registerLimiter, validateRegister, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    const verificationToken = uuidv4();
    const user = await User.create({
      email,
      password_hash: password, // Will be hashed by beforeCreate hook
      name,
      verification_token: verificationToken,
      email_verified: true // Auto-verify for now; enable email verification later
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refresh_token = refreshToken;
    await user.save();

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      user: user.toJSON(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refresh_token = refreshToken;
    await user.save();

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: user.toJSON(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token không được cung cấp' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ error: 'Refresh token không hợp lệ' });
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refresh_token = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token đã hết hạn' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.refresh_token = null;
    await req.user.save();
    res.json({ success: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

// PUT /api/auth/update-profile
router.put('/update-profile', authenticate, validateUpdateProfile, async (req, res) => {
  try {
    const { name, phone, gender, birthday } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (gender !== undefined) updates.gender = gender;
    if (birthday !== undefined) updates.birthday = birthday;

    await req.user.update(updates);
    res.json({ success: true, user: req.user.toJSON(), message: 'Cập nhật thành công' });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const valid = await req.user.validatePassword(currentPassword);
    if (!valid) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    const bcrypt = (await import('bcrypt')).default;
    req.user.password_hash = await bcrypt.hash(newPassword, 12);
    await req.user.save();

    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
