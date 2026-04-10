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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email không được để trống' });
    }

    const user = await User.findOne({ where: { email } });
    
    // Always return success to not reveal if email exists (security)
    if (!user) {
      return res.json({ success: true, message: 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn khôi phục.' });
    }

    // Generate reset token
    const resetToken = uuidv4();
    user.reset_token = resetToken;
    user.reset_token_expires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Try to send email (will log warning if SMTP not configured)
    try {
      const { sendEmail } = await import('../services/emailService.js');
      await sendEmail({
        to: user.email,
        subject: 'Khôi phục mật khẩu - FashionShop',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#f97316">FashionShop - Khôi phục mật khẩu</h2>
            <p>Xin chào <strong>${user.name}</strong>,</p>
            <p>Bạn đã yêu cầu khôi phục mật khẩu. Mã xác nhận của bạn là:</p>
            <p style="font-size:24px;font-weight:bold;color:#f97316;text-align:center">${resetToken}</p>
            <p>Mã này có hiệu lực trong 1 giờ.</p>
            <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
            <hr>
            <p style="color:#666;font-size:12px">FashionShop - Thời trang hiện đại</p>
          </div>
        `
      });
    } catch {
      logger.warn(`Could not send reset email to ${email} — SMTP not configured`);
    }

    logger.info(`Password reset requested for: ${email}`);
    res.json({ success: true, message: 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn khôi phục.' });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token và mật khẩu mới không được để trống' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const { Op } = await import('sequelize');
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    const bcrypt = (await import('bcrypt')).default;
    user.password_hash = await bcrypt.hash(password, 12);
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    logger.info(`Password reset completed for: ${user.email}`);
    res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;

