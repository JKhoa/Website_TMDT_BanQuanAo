-- MOCK DATA CHO BANG DANH MUC (CATEGORIES)

INSERT INTO public.categories (id, name, slug, image_url) VALUES ('11111111-1111-1111-1111-000000000316', 'Nam', 'nam', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600') ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (id, name, slug, image_url) VALUES ('11111111-1111-1111-1111-000000000227', 'Nữ', 'nu', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600') ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (id, name, slug, image_url) VALUES ('11111111-1111-1111-1111-000000000586', 'Trẻ em', 'tre-em', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600') ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.categories (id, name, slug, image_url) VALUES ('11111111-1111-1111-1111-000000000801', 'Phụ kiện', 'phu-kien', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600') ON CONFLICT (slug) DO NOTHING;

-- MOCK DATA CHO BANG SAN PHAM (PRODUCTS)

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Áo Thun Nam Premium',
  'at-nam-001',
  'Áo thun nam cao cấp, chất liệu cotton thoáng mát, form dáng regular fit phù hợp mọi vóc dáng. Đường may tinh tế, không xù lông sau nhiều lần giặt.',
  299000,
  199000,
  150,
  '11111111-1111-1111-1111-000000000316',
  '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600","https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600"]'::jsonb,
  '["Đen","Trắng","Xám","Navy"]'::jsonb,
  '["S","M","L","XL","XXL"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Áo Sơ Mi Nam Công Sở',
  'asm-nam-001',
  'Áo sơ mi nam công sở, thiết kế thanh lịch, dễ dàng phối đồ. Chất vải mềm mại, không nhăn, phù hợp cho môi trường công sở.',
  450000,
  350000,
  80,
  '11111111-1111-1111-1111-000000000316',
  '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600","https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"]'::jsonb,
  '["Trắng","Xanh nhạt","Hồng","Xám"]'::jsonb,
  '["S","M","L","XL"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Áo Khoác Bomber Nam',
  'ak-nam-001',
  'Áo khoác bomber phong cách năng động, giữ ấm tốt. Thiết kế hiện đại với khóa kéo chắc chắn và túi tiện lợi.',
  890000,
  690000,
  45,
  '11111111-1111-1111-1111-000000000316',
  '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600","https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"]'::jsonb,
  '["Đen","Navy","Xanh rêu"]'::jsonb,
  '["M","L","XL","XXL"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000004',
  'Quần Jeans Nam Slim Fit',
  'qj-nam-001',
  'Quần jeans nam form slim fit ôm vừa phải, tôn dáng. Co giãn tốt, thoải mái khi vận động.',
  550000,
  450000,
  120,
  '11111111-1111-1111-1111-000000000316',
  '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600","https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600"]'::jsonb,
  '["Xanh đậm","Xanh nhạt","Đen"]'::jsonb,
  '["29","30","31","32","33","34"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000012',
  'Quần Short Nam Kaki',
  'qs-nam-001',
  'Quần short nam kaki thoáng mát cho mùa hè. Form regular fit, có túi tiện lợi.',
  320000,
  250000,
  90,
  '11111111-1111-1111-1111-000000000316',
  '["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600"]'::jsonb,
  '["Be","Xanh navy","Đen"]'::jsonb,
  '["29","30","31","32","33","34"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000013',
  'Áo Thun Henley Nam',
  'at-nam-002',
  'Áo thun henley nam cổ tròn nút, phong cách casual hiện đại. Chất cotton slub mềm mại tự nhiên.',
  350000,
  350000,
  65,
  '11111111-1111-1111-1111-000000000316',
  '["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600"]'::jsonb,
  '["Trắng","Đen","Xám đậm"]'::jsonb,
  '["S","M","L","XL"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000005',
  'Váy Maxi Nữ Dự Tiệc',
  'vm-nu-001',
  'Váy maxi sang trọng, phù hợp dự tiệc và sự kiện quan trọng. Chất lụa mềm rủ, tôn dáng người mặc.',
  750000,
  550000,
  30,
  '11111111-1111-1111-1111-000000000227',
  '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600","https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"]'::jsonb,
  '["Đỏ","Đen","Trắng","Xanh navy"]'::jsonb,
  '["S","M","L"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000006',
  'Áo Kiểu Nữ Công Sở',
  'ak-nu-001',
  'Áo kiểu nữ thanh lịch, dễ phối đồ công sở. Thiết kế cổ V trang nhã, tay loe nhẹ nhàng.',
  350000,
  250000,
  95,
  '11111111-1111-1111-1111-000000000227',
  '["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600","https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=600"]'::jsonb,
  '["Trắng","Be","Xanh nhạt","Hồng"]'::jsonb,
  '["S","M","L","XL"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000014',
  'Áo Thun Nữ Oversize',
  'at-nu-001',
  'Áo thun nữ oversize trẻ trung, phong cách Hàn Quốc. Chất cotton mềm mại, thoáng mát.',
  280000,
  220000,
  200,
  '11111111-1111-1111-1111-000000000227',
  '["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600"]'::jsonb,
  '["Trắng","Đen","Hồng pastel","Xanh mint"]'::jsonb,
  '["S","M","L"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000015',
  'Váy Liền Body Nữ',
  'vl-nu-001',
  'Váy liền body tôn dáng, phù hợp đi tiệc hoặc đi chơi. Chất thun co giãn 4 chiều thoải mái.',
  490000,
  390000,
  55,
  '11111111-1111-1111-1111-000000000227',
  '["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600"]'::jsonb,
  '["Đen","Đỏ","Be"]'::jsonb,
  '["S","M","L"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000016',
  'Quần Culottes Nữ',
  'qc-nu-001',
  'Quần culottes nữ ống rộng thanh lịch, phù hợp công sở và dạo phố. Chất vải rủ đẹp, thoáng mát.',
  420000,
  340000,
  70,
  '11111111-1111-1111-1111-000000000227',
  '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600"]'::jsonb,
  '["Đen","Be","Trắng"]'::jsonb,
  '["S","M","L","XL"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000017',
  'Áo Croptop Nữ Thể Thao',
  'act-nu-001',
  'Áo croptop nữ năng động, phù hợp tập gym và dạo phố. Co giãn tốt, thấm hút mồ hôi.',
  250000,
  190000,
  130,
  '11111111-1111-1111-1111-000000000227',
  '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"]'::jsonb,
  '["Đen","Trắng","Hồng","Xám"]'::jsonb,
  '["S","M","L"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000007',
  'Túi Xách Tote Cao Cấp',
  'tx-pk-001',
  'Túi xách tote thời trang, thiết kế sang trọng. Nhiều ngăn tiện lợi, phù hợp đi làm và dạo phố.',
  890000,
  690000,
  60,
  '11111111-1111-1111-1111-000000000801',
  '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"]'::jsonb,
  '["Đen","Nâu","Be"]'::jsonb,
  '["One Size"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000008',
  'Giày Sneaker Thể Thao',
  'gs-pk-001',
  'Giày sneaker thể thao năng động, đế êm ái khi di chuyển. Thiết kế hiện đại, phù hợp mọi outfit.',
  1200000,
  950000,
  75,
  '11111111-1111-1111-1111-000000000801',
  '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600","https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"]'::jsonb,
  '["Trắng","Đen","Trắng/Đen"]'::jsonb,
  '["38","39","40","41","42","43"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000019',
  'Thắt Lưng Da Nam',
  'tl-pk-001',
  'Thắt lưng da bò thật cao cấp, khóa kim loại sáng bóng. Phù hợp đi làm và dự tiệc.',
  450000,
  350000,
  85,
  '11111111-1111-1111-1111-000000000801',
  '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"]'::jsonb,
  '["Đen","Nâu"]'::jsonb,
  '["S (85cm)","M (95cm)","L (105cm)","XL (115cm)"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000020',
  'Kính Mát Thời Trang',
  'km-pk-001',
  'Kính mát thời trang chống UV400, tròng Polarized chống chói. Thiết kế unisex phù hợp mọi khuôn mặt.',
  350000,
  280000,
  110,
  '11111111-1111-1111-1111-000000000801',
  '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"]'::jsonb,
  '["Đen","Nâu","Vàng hổ phách"]'::jsonb,
  '["One Size"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000009',
  'Bộ Đồ Trẻ Em Cotton',
  'bd-te-001',
  'Bộ đồ trẻ em an toàn, thoáng mát cho bé. Cotton organic 100%, không gây kích ứng da bé.',
  350000,
  250000,
  100,
  '11111111-1111-1111-1111-000000000586',
  '["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600"]'::jsonb,
  '["Xanh","Hồng","Vàng"]'::jsonb,
  '["2-3 tuổi","4-5 tuổi","6-7 tuổi","8-9 tuổi"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000021',
  'Áo Thun Trẻ Em In Hình',
  'at-te-001',
  'Áo thun trẻ em in hình ngộ nghĩnh, chất cotton mềm mại an toàn cho bé.',
  199000,
  149000,
  150,
  '11111111-1111-1111-1111-000000000586',
  '["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600"]'::jsonb,
  '["Trắng","Đỏ","Xanh"]'::jsonb,
  '["3-4 tuổi","5-6 tuổi","7-8 tuổi","9-10 tuổi"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000022',
  'Quần Short Trẻ Em',
  'qs-te-001',
  'Quần short trẻ em thoáng mát cho mùa hè. Chất kaki mềm, có dây rút thun tiện lợi.',
  180000,
  180000,
  80,
  '11111111-1111-1111-1111-000000000586',
  '["https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600"]'::jsonb,
  '["Navy","Xám","Be"]'::jsonb,
  '["3-4 tuổi","5-6 tuổi","7-8 tuổi","9-10 tuổi"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000023',
  'Đầm Midi Nữ Hoa Nhí',
  'dm-nu-001',
  'Đầm midi nữ hoạ tiết hoa nhí nữ tính, phom dáng xòe nhẹ bay bổng. Phù hợp đi dạo phố, du lịch.',
  580000,
  420000,
  45,
  '11111111-1111-1111-1111-000000000227',
  '["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"]'::jsonb,
  '["Hồng hoa nhí","Xanh hoa nhí","Vàng hoa nhí"]'::jsonb,
  '["S","M","L"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000024',
  'Áo Sơ Mi Oxford Nam',
  'asm-nam-002',
  'Áo sơ mi Oxford nam chất liệu dày dặn, lịch lãm. Phong cách smart casual hoàn hảo.',
  520000,
  520000,
  60,
  '11111111-1111-1111-1111-000000000316',
  '["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"]'::jsonb,
  '["Trắng","Xanh oxford","Xám nhạt"]'::jsonb,
  '["S","M","L","XL"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, sale_price, stock, category_id, images, colors, sizes) VALUES (
  '00000000-0000-0000-0000-000000000025',
  'Quần Jogger Nam',
  'qjg-nam-001',
  'Quần jogger nam phong cách thể thao, bo chun co giãn. Phù hợp tập gym, chạy bộ hoặc dạo phố.',
  420000,
  320000,
  110,
  '11111111-1111-1111-1111-000000000316',
  '["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600"]'::jsonb,
  '["Đen","Xám","Navy"]'::jsonb,
  '["S","M","L","XL"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

