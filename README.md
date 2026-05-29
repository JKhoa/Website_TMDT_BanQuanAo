# Fashion Ecommerce Website

🛒 Một trang web thương mại điện tử mua bán quần áo thời trang, được xây dựng với kiến trúc Fullstack hiện đại sử dụng **Next.js 14 (App Router)** và **Supabase**.

## 🚀 Tính năng nổi bật
- **Giao diện người dùng (Storefront)**: Hiển thị danh sách sản phẩm, chi tiết sản phẩm, tìm kiếm, lọc theo danh mục, thêm vào giỏ hàng, danh sách yêu thích.
- **Xác thực (Authentication)**: Đăng ký, đăng nhập, quên mật khẩu (sử dụng Supabase Auth) hoàn toàn bảo mật.
- **Tài khoản cá nhân**: Xem thông tin tài khoản, lịch sử mua hàng, địa chỉ giao hàng.
- **Quản trị (Admin Dashboard)**: Giao diện quản lý dành riêng cho admin để thêm/sửa/xóa sản phẩm, quản lý đơn hàng, theo dõi khách hàng.
- **Lưu trữ ảnh (Storage)**: Upload hình ảnh sản phẩm và avatar trực tiếp lên Supabase Storage.
- **Bảo mật & Tối ưu**: Sử dụng Next.js Server Actions giúp bảo mật API nội bộ, SSR/SSG hỗ trợ SEO và tối ưu hóa hiệu suất hiển thị.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router), React 18
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend as a Service (BaaS)**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Render.com

## 💻 Cài đặt để chạy Local (Trên máy tính cá nhân)

### Bước 1: Clone mã nguồn
```bash
git clone https://github.com/JKhoa/Website_TMDT_BanQuanAo.git
cd Website_TMDT_BanQuanAo
```

### Bước 2: Cài đặt thư viện
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường
Tạo một file `.env.local` ở thư mục gốc và cung cấp các khóa API từ tài khoản Supabase của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```
*(Bạn có thể lấy 2 mã này trong trang Supabase Dashboard -> Project Settings -> API).*

### Bước 4: Khởi chạy dự án
```bash
npm run dev
```
Truy cập `http://localhost:3000` trên trình duyệt để xem trang web!

## ☁️ Hướng dẫn Triển khai (Deploy) lên Render.com

Dự án này đã được cấu hình sẵn tính năng Deploy tự động qua file `render.yaml`.
1. Đăng nhập vào [Render.com](https://render.com).
2. Chọn **New +** -> **Blueprint**.
3. Kết nối với tài khoản GitHub và chọn Repository này.
4. Render sẽ tự động đọc file `render.yaml` và thiết lập cấu hình chạy (Next.js Node server).
5. (Quan trọng): Cấu hình các biến môi trường `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong phần Environment của dịch vụ Web Service trên Render.

**Lưu ý sau khi Deploy:** 
Bạn bắt buộc phải vào **Supabase Dashboard -> Authentication -> URL Configuration**, thiết lập *Site URL* và *Redirect URLs* khớp với tên miền của Render (Ví dụ: `https://fashionshop-web.onrender.com`) để chức năng Đăng nhập hoạt động chính xác.

## 🔑 Tài khoản mặc định (Dành cho Demo)
Bạn có thể tự đăng ký một tài khoản mới qua màn hình Đăng ký, hoặc sử dụng tài khoản Admin cấp cao có sẵn (nếu cấu hình trong DB):
- **Email**: `admin@fashionshop.vn`
- **Mật khẩu**: `Admin123!`
