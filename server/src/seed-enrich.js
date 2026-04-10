/**
 * Enrichment Seed Script
 * ---------------------
 * This script PRESERVES all existing Products & Categories.
 * It only adds/replaces: Users (customers), Orders, OrderItems, Reviews.
 * 
 * Run: node server/src/seed-enrich.js
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

import { sequelize, User, Product, Category, Review, Order, OrderItem } from './models/index.js';

// ═══════════════════════════════════════════════════════
// Vietnamese name pools for realistic customer generation
// ═══════════════════════════════════════════════════════
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const middleNames = ['Văn', 'Thị', 'Minh', 'Hoàng', 'Đức', 'Thanh', 'Quốc', 'Ngọc', 'Hữu', 'Công', 'Xuân', 'Bảo'];
const firstNames = ['An', 'Bình', 'Chi', 'Dung', 'Hà', 'Hùng', 'Khoa', 'Lan', 'Mai', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tú', 'Vy', 'Yến', 'Đạt', 'Huy', 'Linh', 'Trang', 'Thảo', 'Tuấn', 'Giang', 'Hạnh', 'Long', 'Nga', 'Phúc', 'Thành', 'Trinh', 'Uyên'];

const cities = [
  { city: 'TP. Hồ Chí Minh', districts: ['Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Thủ Đức'] },
  { city: 'Hà Nội', districts: ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Cầu Giấy', 'Thanh Xuân', 'Hai Bà Trưng', 'Long Biên'] },
  { city: 'Đà Nẵng', districts: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn'] },
  { city: 'Cần Thơ', districts: ['Ninh Kiều', 'Cái Răng', 'Bình Thủy'] },
  { city: 'Hải Phòng', districts: ['Hồng Bàng', 'Lê Chân', 'Ngô Quyền'] }
];

const streets = ['Nguyễn Huệ', 'Lê Lợi', 'Trần Hưng Đạo', 'Hai Bà Trưng', 'Lý Tự Trọng', 'Võ Văn Tần', 'Nguyễn Trãi', 'Phạm Ngọc Thạch', 'Điện Biên Phủ', 'Cách Mạng Tháng 8', 'Lê Duẩn', 'Nguyễn Đình Chiểu', 'Pasteur', 'Nam Kỳ Khởi Nghĩa'];

const reviewComments = {
  5: [
    'Sản phẩm rất tốt, đúng mô tả. Sẽ mua lại!',
    'Chất lượng tuyệt vời, giao hàng nhanh. 5 sao!',
    'Rất hài lòng với sản phẩm này. Recommend cho mọi người.',
    'Đẹp hơn ảnh, chất vải mềm mại. Shop uy tín!',
    'Mua lần 2 rồi, vẫn rất thích. Giá hợp lý.',
    'Sản phẩm xịn, đóng gói cẩn thận. Cảm ơn shop!',
    'Form đẹp, mặc thoải mái. Sẽ giới thiệu cho bạn bè.',
    'Quá đẹp luôn! Chất lượng vượt mong đợi.',
  ],
  4: [
    'Sản phẩm tốt, chỉ hơi rộng 1 size. Nên chọn nhỏ hơn.',
    'Chất lượng ổn, giao hàng nhanh. Sẽ quay lại.',
    'Đẹp, nhưng màu thực tế hơi khác ảnh một chút.',
    'Form chuẩn, chất vải OK. Giá hợp lý.',
    'Sản phẩm khá tốt so với giá tiền.',
    'Mặc thoải mái, không bị xù lông sau giặt.',
  ],
  3: [
    'Sản phẩm tạm ổn, chất vải hơi mỏng.',
    'Được, nhưng giao hàng hơi chậm.',
    'Đường may chưa thật sự tinh tế.',
  ],
  2: [
    'Chất lượng không như mong đợi.',
    'Size không chuẩn, phải đổi.',
  ]
};

const paymentMethods = ['cod', 'banking', 'momo', 'zalopay'];
const shippingMethods = ['standard', 'express'];

// ═══════════════════════════════════════════════════════
// Utility helpers
// ═══════════════════════════════════════════════════════
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function generatePhone() { return `09${randInt(10000000, 99999999)}`; }

function generateAddress() {
  const loc = pick(cities);
  const district = pick(loc.districts);
  const num = randInt(1, 200);
  const street = pick(streets);
  return {
    address: `${num} ${street}`,
    district,
    city: loc.city,
    ward: `Phường ${randInt(1, 15)}`
  };
}

// ═══════════════════════════════════════════════════════
// Main seed function
// ═══════════════════════════════════════════════════════
async function seedEnrich() {
  try {
    console.log('🌱 Starting enrichment seed...');
    console.log('📦 Products & Categories will be PRESERVED\n');

    // Sync tables (no force — preserves existing data)
    await sequelize.sync();
    console.log('✅ Database synced (non-destructive)');

    // ─── Check existing products ───
    const existingProducts = await Product.findAll({ raw: true });
    if (existingProducts.length === 0) {
      console.error('❌ No products found in database! Run the main seed first or add products via admin.');
      process.exit(1);
    }
    console.log(`📦 Found ${existingProducts.length} existing products (preserved)`);

    // ─── Clear transactional data only ───
    console.log('🗑️  Clearing old transactional data...');
    await OrderItem.destroy({ where: {}, truncate: true });
    await Order.destroy({ where: {}, truncate: true });
    await Review.destroy({ where: {}, truncate: true });
    await User.destroy({ where: { role: 'customer' } });
    console.log('✅ Old orders, reviews, and customers cleared');

    // ─── Ensure admin user exists ───
    const [admin] = await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL || 'admin@fashionshop.vn' },
      defaults: {
        password_hash: process.env.ADMIN_PASSWORD || 'Admin123!',
        name: 'Admin FashionShop',
        role: 'admin',
        email_verified: true,
        phone: '0123456789'
      }
    });
    console.log(`✅ Admin: ${admin.email}`);

    // ─── Create 20 customers ───
    console.log('👥 Creating customers...');
    const customers = [];
    for (let i = 1; i <= 20; i++) {
      const name = `${pick(lastNames)} ${pick(middleNames)} ${pick(firstNames)}`;
      const emailPrefix = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, '.');
      const customer = await User.create({
        email: `${emailPrefix}${i}@gmail.com`,
        password_hash: 'Customer123!',
        name,
        role: 'customer',
        email_verified: true,
        phone: generatePhone(),
        gender: Math.random() > 0.5 ? 'male' : 'female',
        birthday: new Date(randInt(1985, 2003), randInt(0, 11), randInt(1, 28))
      });
      customers.push(customer);
    }
    console.log(`✅ ${customers.length} customers created`);

    // ─── Create reviews for every product ───
    console.log('⭐ Creating reviews...');
    let reviewCount = 0;
    for (const product of existingProducts) {
      const numReviews = randInt(3, 8);
      const shuffledCustomers = [...customers].sort(() => Math.random() - 0.5);
      let totalRating = 0;

      for (let r = 0; r < numReviews && r < shuffledCustomers.length; r++) {
        // Weighted: 50% = 5★, 30% = 4★, 15% = 3★, 5% = 2★
        const roll = Math.random();
        const rating = roll < 0.05 ? 2 : roll < 0.20 ? 3 : roll < 0.50 ? 4 : 5;
        const comments = reviewComments[rating];
        const comment = pick(comments);
        const daysAgo = randInt(1, 90);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);

        await Review.create({
          product_id: product.id,
          user_id: shuffledCustomers[r].id,
          user_name: shuffledCustomers[r].name,
          rating,
          comment,
          helpful: randInt(0, 25),
          created_at: createdAt,
          updated_at: createdAt
        });
        totalRating += rating;
        reviewCount++;
      }

      // Update product rating
      const avgRating = Math.round((totalRating / numReviews) * 10) / 10;
      await Product.update(
        { rating: avgRating, review_count: numReviews },
        { where: { id: product.id } }
      );
    }
    console.log(`✅ ${reviewCount} reviews created`);

    // ─── Create 90 days of orders (~120 total, ~100 completed) ───
    console.log('📊 Generating 90 days of order history (small shop scale)...');
    const now = new Date();
    let totalOrders = 0;
    let totalRevenue = 0;

    // Popularity weights — some products sell much more
    const productWeights = existingProducts.map((p, i) => ({
      product: p,
      weight: p.is_best_seller ? 4 : p.is_flash_sale ? 3 : p.sale_price ? 2 : 1
    }));
    const totalWeight = productWeights.reduce((s, w) => s + w.weight, 0);

    function pickWeightedProduct() {
      let r = Math.random() * totalWeight;
      for (const { product, weight } of productWeights) {
        r -= weight;
        if (r <= 0) return product;
      }
      return productWeights[0].product;
    }

    for (let day = 89; day >= 0; day--) {
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - day);

      // Small shop: 0-3 orders per day, averaging ~1.3/day → ~120 over 90 days
      const isWeekend = orderDate.getDay() === 0 || orderDate.getDay() === 6;
      const roll = Math.random();
      let ordersForDay;
      if (isWeekend) {
        // Weekend: 60% chance 2 orders, 25% chance 1, 10% chance 3, 5% chance 0
        ordersForDay = roll < 0.05 ? 0 : roll < 0.30 ? 1 : roll < 0.90 ? 2 : 3;
      } else {
        // Weekday: 35% chance 1, 30% chance 2, 20% chance 0, 15% chance 3
        ordersForDay = roll < 0.20 ? 0 : roll < 0.55 ? 1 : roll < 0.85 ? 2 : 3;
      }

      for (let j = 0; j < ordersForDay; j++) {
        const customer = pick(customers);
        const loc = generateAddress();

        // Small orders: 1-2 items, quantity always 1
        const itemsCount = randInt(1, 2);
        let subtotal = 0;
        const orderItemsData = [];
        const usedProductIds = new Set();

        for (let k = 0; k < itemsCount; k++) {
          let product;
          let attempts = 0;
          do {
            product = pickWeightedProduct();
            attempts++;
          } while (usedProductIds.has(product.id) && attempts < 10);
          
          if (usedProductIds.has(product.id)) continue;
          usedProductIds.add(product.id);

          const price = Number(product.sale_price || product.price);
          const quantity = 1; // Always 1 for small shop
          const sizes = (() => { try { return JSON.parse(product.sizes); } catch { return ['M']; } })();
          const colors = (() => { try { return JSON.parse(product.colors); } catch { return ['Đen']; } })();

          subtotal += price * quantity;
          orderItemsData.push({
            product_id: product.id,
            product_name: product.name,
            product_image: product.image || '',
            quantity,
            price,
            size: pick(sizes),
            color: pick(colors)
          });
        }

        if (orderItemsData.length === 0) continue;

        const shippingFee = subtotal > 500000 ? 0 : 30000;
        const total = subtotal + shippingFee;

        // Status: target ~100 completed out of ~120
        let status;
        if (day === 0) {
          status = pick(['pending', 'pending', 'confirmed']);
        } else if (day <= 2) {
          status = pick(['pending', 'confirmed', 'shipping']);
        } else if (day <= 5) {
          status = pick(['shipping', 'completed', 'completed']);
        } else {
          // Older: 85% completed, 8% cancelled, 7% other
          const sRoll = Math.random();
          status = sRoll < 0.85 ? 'completed' : sRoll < 0.93 ? 'cancelled' : 'shipping';
        }

        // Random time within the day
        const orderTime = new Date(orderDate);
        orderTime.setHours(randInt(7, 23), randInt(0, 59), randInt(0, 59));

        const order = await Order.create({
          user_id: customer.id,
          subtotal,
          shipping_fee: shippingFee,
          total,
          status,
          payment_method: pick(paymentMethods),
          shipping_method: pick(shippingMethods),
          shipping_name: customer.name,
          shipping_phone: customer.phone,
          shipping_address: loc.address,
          shipping_city: loc.city,
          shipping_district: loc.district,
          shipping_ward: loc.ward,
          created_at: orderTime,
          updated_at: orderTime
        });

        for (const item of orderItemsData) {
          await OrderItem.create({
            ...item,
            order_id: order.id,
            created_at: orderTime,
            updated_at: orderTime
          });
        }

        totalOrders++;
        if (status !== 'cancelled') totalRevenue += total;
      }
    }

    console.log(`\n✅ ${totalOrders} orders created (${(totalRevenue / 1000000).toFixed(1)}M đ revenue)`);

    // ─── Summary ───
    const summaryOrders = await Order.count();
    const summaryItems = await OrderItem.count();
    const summaryReviews = await Review.count();
    const summaryCustomers = await User.count({ where: { role: 'customer' } });

    console.log('\n' + '═'.repeat(50));
    console.log('🎉 Enrichment seed completed!');
    console.log('═'.repeat(50));
    console.log(`📦 Products:  ${existingProducts.length} (preserved)`);
    console.log(`👥 Customers: ${summaryCustomers}`);
    console.log(`📝 Reviews:   ${summaryReviews}`);
    console.log(`🛒 Orders:    ${summaryOrders}`);
    console.log(`📋 Items:     ${summaryItems}`);
    console.log(`💰 Revenue:   ${(totalRevenue / 1000000).toFixed(1)}M đ`);
    console.log('═'.repeat(50));
    console.log('📧 Admin:    admin@fashionshop.vn / Admin123!');
    console.log('📧 Customer: (any customer) / Customer123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Enrichment seed error:', error);
    process.exit(1);
  }
}

seedEnrich();
