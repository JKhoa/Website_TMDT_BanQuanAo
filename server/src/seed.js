import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

import { sequelize, User, Product, Category, Review, Order, OrderItem } from './models/index.js';
import logger from './utils/logger.js';

const categories = [
  { name: 'Nam', slug: 'nam', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600', subcategories: [{ id: 'ao-nam', name: 'Áo nam' }, { id: 'quan-nam', name: 'Quần nam' }, { id: 'do-the-thao-nam', name: 'Đồ thể thao nam' }] },
  { name: 'Nữ', slug: 'nu', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', subcategories: [{ id: 'ao-nu', name: 'Áo nữ' }, { id: 'quan-nu', name: 'Quần nữ' }, { id: 'vay', name: 'Váy' }, { id: 'dam', name: 'Đầm' }] },
  { name: 'Trẻ em', slug: 'tre-em', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600', subcategories: [{ id: 'ao-tre-em', name: 'Áo trẻ em' }, { id: 'quan-tre-em', name: 'Quần trẻ em' }] },
  { name: 'Phụ kiện', slug: 'phu-kien', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', subcategories: [{ id: 'mu-non', name: 'Mũ nón' }, { id: 'tui-xach', name: 'Túi xách' }, { id: 'that-lung', name: 'Thắt lưng' }] }
];

const products = [
  { name: 'Áo Thun Nam Premium', sku: 'ATN-001', description: 'Áo thun nam cao cấp, chất liệu cotton thoáng mát, form dáng regular fit phù hợp mọi vóc dáng.', price: 299000, sale_price: 199000, stock: 150, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600']), category: 'nam', subcategory: 'ao-nam', brand: 'FashionShop', material: 'Cotton 100%', tags: JSON.stringify(['áo thun', 'cotton', 'nam', 'basic']), sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']), colors: JSON.stringify(['Đen', 'Trắng', 'Xám', 'Navy']), rating: 4.5, review_count: 3, is_best_seller: true, is_new_arrival: false },
  { name: 'Quần Jean Nam Slim Fit', sku: 'QJN-001', description: 'Quần jean nam form slim fit, chất liệu denim co giãn thoải mái.', price: 599000, sale_price: 449000, stock: 80, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600']), category: 'nam', subcategory: 'quan-nam', brand: 'DenimPro', material: 'Denim co giãn', tags: JSON.stringify(['quần jean', 'slim fit', 'nam']), sizes: JSON.stringify(['29', '30', '31', '32', '33', '34']), colors: JSON.stringify(['Xanh đậm', 'Xanh nhạt', 'Đen']), rating: 4.3, review_count: 2, is_best_seller: true },
  { name: 'Áo Sơ Mi Nam Oxford', sku: 'ASM-001', description: 'Áo sơ mi nam Oxford cổ điển, phù hợp công sở và dạo phố.', price: 450000, stock: 100, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600']), category: 'nam', subcategory: 'ao-nam', brand: 'ClassicWear', material: 'Cotton Oxford', tags: JSON.stringify(['sơ mi', 'oxford', 'công sở']), sizes: JSON.stringify(['S', 'M', 'L', 'XL']), colors: JSON.stringify(['Trắng', 'Xanh nhạt', 'Hồng']), rating: 4.7, review_count: 5, is_new_arrival: true },
  { name: 'Áo Polo Nam Sport', sku: 'APN-001', description: 'Áo Polo nam phong cách thể thao, vải Polyester thoáng khí.', price: 350000, sale_price: 280000, stock: 120, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600']), category: 'nam', subcategory: 'ao-nam', brand: 'SportFit', material: 'Polyester', tags: JSON.stringify(['polo', 'thể thao', 'nam']), sizes: JSON.stringify(['S', 'M', 'L', 'XL']), colors: JSON.stringify(['Đen', 'Trắng', 'Đỏ', 'Navy']), rating: 4.2, review_count: 4, is_flash_sale: true },
  { name: 'Váy Maxi Nữ Dự Tiệc', sku: 'VMN-001', description: 'Váy maxi dự tiệc sang trọng, chất liệu voan mềm mại.', price: 890000, sale_price: 690000, stock: 30, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600']), category: 'nu', subcategory: 'vay', brand: 'Elegance', material: 'Voan cao cấp', tags: JSON.stringify(['váy', 'maxi', 'dự tiệc', 'sang trọng']), sizes: JSON.stringify(['S', 'M', 'L']), colors: JSON.stringify(['Đen', 'Đỏ', 'Trắng']), rating: 4.8, review_count: 7, is_best_seller: true },
  { name: 'Áo Blouse Nữ Công Sở', sku: 'ABN-001', description: 'Áo blouse nữ thanh lịch cho phong cách công sở hiện đại.', price: 420000, stock: 90, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600']), category: 'nu', subcategory: 'ao-nu', brand: 'OfficeLady', material: 'Lụa tổng hợp', tags: JSON.stringify(['blouse', 'công sở', 'nữ']), sizes: JSON.stringify(['S', 'M', 'L', 'XL']), colors: JSON.stringify(['Trắng', 'Hồng', 'Xanh nhạt']), rating: 4.4, review_count: 3, is_new_arrival: true },
  { name: 'Quần Tây Nam Classic', sku: 'QTN-001', description: 'Quần tây nam form regular, phù hợp mọi dịp.', price: 520000, stock: 60, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600']), category: 'nam', subcategory: 'quan-nam', brand: 'ClassicWear', material: 'Polyester pha', tags: JSON.stringify(['quần tây', 'classic', 'công sở']), sizes: JSON.stringify(['29', '30', '31', '32', '33']), colors: JSON.stringify(['Đen', 'Xám', 'Navy']), rating: 4.1, review_count: 2 },
  { name: 'Đầm Nữ Hoa Nhí', sku: 'DNN-001', description: 'Đầm nữ hoa nhí xinh xắn, phù hợp dạo phố cuối tuần.', price: 650000, sale_price: 520000, stock: 45, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600']), category: 'nu', subcategory: 'dam', brand: 'FloralStyle', material: 'Cotton pha', tags: JSON.stringify(['đầm', 'hoa nhí', 'dạo phố']), sizes: JSON.stringify(['S', 'M', 'L']), colors: JSON.stringify(['Trắng hoa', 'Xanh hoa', 'Hồng hoa']), rating: 4.6, review_count: 6, is_flash_sale: true },
  { name: 'Áo Khoác Bomber Nam', sku: 'AKB-001', description: 'Áo khoác bomber nam cá tính, chất liệu dù nhẹ chống nắng.', price: 750000, stock: 40, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600']), category: 'nam', subcategory: 'ao-nam', brand: 'UrbanStreet', material: 'Vải dù cao cấp', tags: JSON.stringify(['áo khoác', 'bomber', 'street']), sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']), colors: JSON.stringify(['Đen', 'Xanh rêu', 'Be']), rating: 4.5, review_count: 4, is_new_arrival: true },
  { name: 'Set Bộ Bé Trai Thể Thao', sku: 'SBT-001', description: 'Set bộ thể thao cho bé trai, thoáng mát và năng động.', price: 280000, sale_price: 220000, stock: 70, image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600']), category: 'tre-em', subcategory: 'ao-tre-em', brand: 'KidsFun', material: 'Cotton co giãn', tags: JSON.stringify(['trẻ em', 'thể thao', 'bé trai']), sizes: JSON.stringify(['90', '100', '110', '120', '130']), colors: JSON.stringify(['Xanh', 'Đỏ', 'Xám']), rating: 4.3, review_count: 3, is_best_seller: true },
  { name: 'Mũ Lưỡi Trai Unisex', sku: 'MLT-001', description: 'Mũ lưỡi trai phong cách, chống nắng hiệu quả.', price: 180000, stock: 200, image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600']), category: 'phu-kien', subcategory: 'mu-non', brand: 'CapStyle', material: 'Cotton', tags: JSON.stringify(['mũ', 'phụ kiện', 'unisex']), sizes: JSON.stringify(['Free size']), colors: JSON.stringify(['Đen', 'Trắng', 'Navy', 'Be']), rating: 4.0, review_count: 2 },
  { name: 'Túi Tote Nữ Canvas', sku: 'TTN-001', description: 'Túi tote canvas phong cách Hàn Quốc, đựng đồ tiện dụng.', price: 250000, stock: 100, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600', images: JSON.stringify(['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600']), category: 'phu-kien', subcategory: 'tui-xach', brand: 'CanvasBag', material: 'Canvas dày', tags: JSON.stringify(['túi', 'tote', 'canvas', 'nữ']), sizes: JSON.stringify(['Free size']), colors: JSON.stringify(['Trắng', 'Đen', 'Kem']), rating: 4.2, review_count: 3, is_new_arrival: true }
];

const reviews = [
  { product_id: 1, user_name: 'Nguyễn Văn A', rating: 5, comment: 'Áo thun rất đẹp, chất cotton mát, form chuẩn. Sẽ quay lại mua thêm!' },
  { product_id: 1, user_name: 'Trần Thị B', rating: 4, comment: 'Chất lượng tốt, giao hàng nhanh. Hơi rộng so với size thường.' },
  { product_id: 1, user_name: 'Lê Văn C', rating: 5, comment: 'Giá hợp lý, chất vải mềm mại. Rất hài lòng!' },
  { product_id: 2, user_name: 'Phạm D', rating: 4, comment: 'Quần jean đẹp, form slim fit vừa vặn.' },
  { product_id: 2, user_name: 'Nguyễn E', rating: 5, comment: 'Denim co giãn thoải mái, đường may chắc chắn.' },
  { product_id: 5, user_name: 'Trần F', rating: 5, comment: 'Váy maxi rất sang trọng, vải voan mềm đẹp.' },
  { product_id: 5, user_name: 'Lê G', rating: 4, comment: 'Đẹp nhưng hơi dài với người thấp.' },
  { product_id: 3, user_name: 'Nguyễn H', rating: 5, comment: 'Sơ mi Oxford rất đẹp, mặc đi làm rất lịch sự.' },
  { product_id: 8, user_name: 'Phạm I', rating: 5, comment: 'Đầm hoa nhí xinh lắm, đúng mô tả!' },
  { product_id: 9, user_name: 'Trần K', rating: 4, comment: 'Áo khoác bomber chất lượng tốt, nhẹ nhàng.' }
];

async function seed() {
  try {
    console.log('🌱 Starting seed...');
    
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create admin user
    await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@fashionshop.vn',
      password_hash: process.env.ADMIN_PASSWORD || 'Admin123!',
      name: 'Admin FashionShop',
      role: 'admin',
      email_verified: true,
      phone: '0123456789'
    });
    console.log('✅ Admin user created');

    // Create demo customers
    const customers = [
      { email: 'customer@example.com', password_hash: 'Customer123!', name: 'Nguyễn Văn Khách', role: 'customer', email_verified: true, phone: '0987654321' },
      { email: 'user1@example.com', password_hash: 'Password123!', name: 'Lê Thị Mai', role: 'customer', email_verified: true, phone: '0912345678' },
      { email: 'user2@example.com', password_hash: 'Password123!', name: 'Trần Văn Bình', role: 'customer', email_verified: true, phone: '0923456789' },
      { email: 'user3@example.com', password_hash: 'Password123!', name: 'Phạm Minh Tuấn', role: 'customer', email_verified: true, phone: '0934567890' },
      { email: 'user4@example.com', password_hash: 'Password123!', name: 'Hoàng Diệu Linh', role: 'customer', email_verified: true, phone: '0945678901' }
    ];

    for (const c of customers) {
      await User.create(c);
    }
    console.log('✅ Demo customers created');

    // Create categories
    for (const cat of categories) {
      await Category.create(cat);
    }
    console.log(`✅ ${categories.length} categories created`);

    // Create products
    const dbProducts = [];
    for (const prod of products) {
      const p = await Product.create(prod);
      dbProducts.push(p);
    }
    console.log(`✅ ${products.length} products created`);

    // Create reviews
    for (const review of reviews) {
      await Review.create({ ...review, user_id: 2 });
    }
    console.log(`✅ ${reviews.length} reviews created`);

    // Create historical orders for dashboard
    console.log('📊 Creating historical orders...');
    const now = new Date();
    
    // Generate orders for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - i);
      
      // Random number of orders per day (0 to 3)
      const ordersCount = Math.floor(Math.random() * 4);
      
      for (let j = 0; j < ordersCount; j++) {
        const customerId = Math.floor(Math.random() * 5) + 2; // IDs 2-6 are customers
        const customer = customers[customerId - 2];
        
        // Random products for the order (1 to 3)
        const itemsCount = Math.floor(Math.random() * 3) + 1;
        let subtotal = 0;
        const orderItemsData = [];
        
        for (let k = 0; k < itemsCount; k++) {
          const product = dbProducts[Math.floor(Math.random() * dbProducts.length)];
          const price = product.sale_price || product.price;
          const quantity = Math.floor(Math.random() * 2) + 1;
          
          subtotal += price * quantity;
          orderItemsData.push({
            product_id: product.id,
            product_name: product.name,
            product_image: product.image,
            quantity,
            price,
            size: JSON.parse(product.sizes)[0],
            color: JSON.parse(product.colors)[0]
          });
        }
        
        const shippingFee = subtotal > 500000 ? 0 : 30000;
        const total = subtotal + shippingFee;
        
        const order = await Order.create({
          user_id: customerId,
          subtotal,
          shipping_fee: shippingFee,
          total,
          status: i === 0 ? 'pending' : 'completed',
          payment_method: 'cod',
          shipping_method: 'standard',
          shipping_name: customer.name,
          shipping_phone: customer.phone,
          shipping_address: '123 Đường ABC, Quận 1, TP.HCM',
          created_at: orderDate,
          updated_at: orderDate
        });
        
        for (const item of orderItemsData) {
          await OrderItem.create({ ...item, order_id: order.id, created_at: orderDate, updated_at: orderDate });
        }
      }
    }
    console.log('✅ Historical orders created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('📧 Admin: admin@fashionshop.vn / Admin123!');
    console.log('📧 Customer: customer@example.com / Customer123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();

