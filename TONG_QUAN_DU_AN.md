# BÁO CÁO TỔNG QUAN DỰ ÁN: WEBSITE THƯƠNG MẠI ĐIỆN TỬ BÁN QUẦN ÁO

## 1. Lý do chọn ngành/mặt hàng để khởi nghiệp
- **Nhu cầu thị trường khổng lồ:** Thời trang là nhu cầu thiết yếu và liên tục thay đổi, cập nhật xu hướng mới từng ngày.
- **Sự bùng nổ của E-commerce:** Thói quen mua sắm trực tuyến của người dùng tại Việt Nam đang phát triển mạnh mẽ.
- **Tệp khách hàng đa dạng:** Quần áo phục vụ cho nhiều lứa tuổi, phong cách và phân khúc thu nhập khác nhau, giúp dễ dàng mở rộng quy mô.

## 2. Lợi thế cạnh tranh
- **Trải nghiệm người dùng (UI/UX) xuất sắc:** Website được xây dựng hiện đại, thiết kế tinh gọn, tốc độ tải trang nhanh và tương thích hoàn toàn với các thiết bị di động (Responsive).
- **Hệ thống đầy đủ tính năng:** Tích hợp quy trình mua sắm từ A-Z, từ việc tìm kiếm, giỏ hàng, thanh toán đến quản lý đơn hàng. Tích hợp cả trang Lookbook giúp người dùng có ý tưởng phối đồ.
- **Công nghệ hiện đại, khả năng mở rộng tốt:** Sử dụng hệ sinh thái MERN Stack / React (kết hợp Tailwind CSS & Shadcn UI) mang lại hiệu năng cao.

## 3. Phân tích điểm mạnh, điểm yếu các đối thủ cùng ngành
- **Điểm mạnh của đối thủ:**
  - Đã có nhận diện thương hiệu tốt và lượng khách hàng trung thành nhất định.
  - Nguồn vốn lớn, chuỗi cung ứng và hệ thống phân phối/vận chuyển vững chắc.
- **Điểm yếu của đối thủ:**
  - Một số website/ứng dụng có giao diện đã cũ, trải nghiệm tìm kiếm chậm hoặc quá phức tạp.
  - Thiếu sự cá nhân hóa (không có Wishlist hoặc Lookbook hướng dẫn phối đồ).
  - Dịch vụ hỗ trợ trực tuyến đôi khi phản hồi chậm.

## 4. Công bố doanh nghiệp
- **Tên dự án:** (Sinh viên bổ sung tên cụ thể của Website)
- **Tầm nhìn:** Trở thành một trong những nền tảng mua sắm thời trang trực tuyến được giới trẻ yêu thích nhất, dẫn đầu về trải nghiệm khách hàng.
- **Sứ mệnh:** Mang tới những sản phẩm thời trang bắt kịp xu hướng với chất lượng tốt, giá thành hợp lý, cùng quy trình mua sắm tiện lợi và an toàn nhất.

## 5. Chiến lược kinh doanh
- Tập trung vào phân phối các mặt hàng thời trang đang trending, giá cả phải chăng phù hợp với sinh viên và dân công sở.
- Tối ưu hóa hệ thống từ lúc tìm kiếm sản phẩm, đặt hàng, xử lý đơn hàng (tại Admin Dashboard) đến tay người tiêu dùng.
- Liên tục lắng nghe đánh giá của khách hàng (thông qua tính năng Review) để cải thiện chất lượng sản phẩm dịch vụ.

## 6. Chiến lược marketing
- **Social Media:** Chạy chiến dịch PR/Marketing trên Facebook, Instagram, TikTok với các hình ảnh/video ngắn bắt mắt.
- **Content Marketing & SEO:** Xây dựng chuyên mục Lookbook, blog tư vấn phối đồ giúp thu hút luồng truy cập tự nhiên.
- **Chăm sóc khách hàng:** Tích hợp luồng gửi email tự động (Email Service) để xác nhận đơn hàng, gửi mã giảm giá và remarketing tới tài khoản người dùng đã đăng ký.

## 7. Demo Website (Khái quát hệ thống)
Dự án được xây dựng với kiến trúc Client-Server hiện đại, đáp ứng đầy đủ yêu cầu của một trang web E-Commerce:

**A. Client (Giao diện Khách hàng & Admin)**
- *Công nghệ:* ReactJS, Vite, Tailwind CSS, Shadcn UI.
- *Tính năng nổi bật cho KH:* 
  - Đăng ký/đăng nhập (AuthContext)
  - Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm, Lookbook
  - Tính năng tìm kiếm (SearchContext), Yêu thích (WishlistContext)
  - Quản lý giỏ hàng (CartContext) và Thanh toán (Checkout)
  - Quản lý tiến trình Đơn hàng & Lịch sử mua hàng cá nhân.
- *Admin Dashboard:* Quản lý thống kê, xử lý Đơn hàng, quản lý Sản phẩm, Phân quyền người dùng (RBAC).

**B. Server (Hệ thống Backend)**
- *Công nghệ:* Node.js, Express, Sequelize (SQLite/PostgreSQL).
- *Hệ thống nghiệp vụ:*
  - Middleware bảo mật và tối ưu: Authentication (JWT), Rate Limiter, RBAC (Role-Based Access Control).
  - Quản lý cơ sở dữ liệu: Models hoàn chỉnh cho User, Category, Product, Order, Review.
  - Xử lý Gửi Email (Email Service).

---
> **Lưu ý báo cáo:** Toàn bộ công việc ở các phần trên và phần demo website sẽ được trình bày súc tích trong vòng 15 phút theo yêu cầu.