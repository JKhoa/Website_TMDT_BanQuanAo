import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const t = getTransporter();
  if (!t) {
    logger.warn(`Email not sent (no SMTP config): ${subject} → ${to}`);
    return false;
  }
  try {
    await t.sendMail({
      from: process.env.EMAIL_FROM || 'FashionShop <noreply@fashionshop.vn>',
      to, subject, html
    });
    logger.info(`Email sent: ${subject} → ${to}`);
    return true;
  } catch (error) {
    logger.error('Email send error:', error);
    return false;
  }
};

export const sendOrderConfirmation = async (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.product_name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.size} / ${item.color}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${Number(item.price).toLocaleString('vi-VN')}đ</td>
    </tr>
  `).join('');

  return sendEmail({
    to: user.email,
    subject: `Đơn hàng #${order.id} đã được đặt thành công`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#f97316">FashionShop - Xác nhận đơn hàng</h2>
        <p>Xin chào <strong>${user.name}</strong>,</p>
        <p>Đơn hàng <strong>#${order.id}</strong> của bạn đã được đặt thành công!</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="background:#f97316;color:white">
            <th style="padding:8px;text-align:left">Sản phẩm</th>
            <th style="padding:8px">Size/Màu</th>
            <th style="padding:8px">SL</th>
            <th style="padding:8px">Giá</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p><strong>Tổng cộng: ${Number(order.total).toLocaleString('vi-VN')}đ</strong></p>
        <p>Giao đến: ${order.shipping_name} - ${order.shipping_phone}<br>${order.shipping_address}</p>
        <hr>
        <p style="color:#666;font-size:12px">FashionShop - Thời trang hiện đại</p>
      </div>
    `
  });
};

export const sendAdminOrderNotification = async (order) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `[Admin] Đơn hàng mới #${order.id}`,
    html: `
      <p>Có đơn hàng mới <strong>#${order.id}</strong></p>
      <p>Tổng: <strong>${Number(order.total).toLocaleString('vi-VN')}đ</strong></p>
      <p>Xem chi tiết tại admin dashboard.</p>
    `
  });
};
