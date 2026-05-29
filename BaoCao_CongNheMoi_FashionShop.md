# BÁO CÁO MÔN HỌC: CÁC CÔNG NGHỆ MỚI TRONG PHÁT TRIỂN ỨNG DỤNG

**Tên dự án:** Phát triển Website Thương mại điện tử FashionShop  
**Đường dẫn dự án (URL):** [https://fashionshop-web.onrender.com/](https://fashionshop-web.onrender.com/)

---

## 1. GIỚI THIỆU CHUNG
FashionShop là ứng dụng thương mại điện tử chuyên cung cấp các sản phẩm thời trang trực tuyến. Dự án được phát triển nhằm mục đích đáp ứng yêu cầu của môn học "Các công nghệ mới trong phát triển ứng dụng". Ứng dụng mang lại trải nghiệm mua sắm trực tuyến mượt mà, tiện lợi cho khách hàng, đồng thời cung cấp một hệ thống quản trị (Dashboard) mạnh mẽ, trực quan cho người quản lý (Admin). 

## 2. PHẠM VI NỘI DUNG VÀ CÔNG NGHỆ ÁP DỤNG

### 2.1. Frontend
*   **Công nghệ:** Next.js 14 (App Router), React Server Components, Client Components, Data Fetching, Server Actions.
*   **Ngôn ngữ:** TypeScript, với type annotations rõ ràng, đảm bảo type-safety trong toàn bộ mã nguồn.
*   **UI Framework:** Tailwind CSS kết hợp với shadcn/ui để thiết kế giao diện sạch sẽ, chuyên nghiệp, responsive và tốc độ tải trang nhanh.

### 2.2. Backend & Cơ sở dữ liệu (BaaS)
*   **Nền tảng:** Supabase (Thay thế hoàn toàn cho custom backend Node/Express cũ để đáp ứng yêu cầu).
*   **Chức năng chính:**
    *   **Supabase Auth:** Quản lý đăng nhập/đăng ký người dùng.
    *   **Supabase Database (PostgreSQL):** Quản lý cấu trúc dữ liệu ứng dụng (Products, Orders, Profiles) với bảo mật Row Level Security (RLS).
    *   **Supabase Storage:** Tích hợp tính năng lưu trữ hình ảnh sản phẩm upload từ Dashboard.

### 2.3. Containerization
*   **Công cụ:** Docker, Docker Compose.
*   **Mô tả:** Ứng dụng được đóng gói hoàn toàn bằng Docker với cơ chế Multi-stage build (standalone mode) nhằm tối ưu hóa cực nhẹ dung lượng image cho production.

### 2.4. Deployment (Triển khai)
*   **Nền tảng:** Render.com (VPS / PaaS platform).
*   **Tên miền & Bảo mật:** URL chính thức [https://fashionshop-web.onrender.com/](https://fashionshop-web.onrender.com/) chạy trên môi trường thực tế với chứng chỉ SSL (HTTPS), trải nghiệm môi trường triển khai thực tế.

### 2.5. Quản lý mã nguồn (Source Code)
*   **Nền tảng:** GitHub.
*   **Quy trình:** Commit history rõ ràng, có tuân thủ cấu trúc, Repository được phân quyền đúng theo yêu cầu.

---

## 3. PHÂN TÍCH CHỨC NĂNG DỰ ÁN

Hệ thống được chia làm hai phân hệ chính:

### 3.1. Dành cho Khách hàng (User)
*   **Đăng ký / Đăng nhập:** Tạo tài khoản qua Email/Mật khẩu bằng Supabase Auth. Tài khoản mặc định có role `user`.
*   **Tìm kiếm & Xem sản phẩm:** Tìm kiếm theo tên, lọc theo danh mục. Xem chi tiết (giá, ảnh carousel), chọn màu sắc, kích thước và số lượng.
*   **Quản lý Giỏ hàng & Đặt hàng:** Thêm vào giỏ (sử dụng Context/LocalStorage), điền thông tin Checkout để lưu vào bảng `orders` của Supabase.
*   **Quản lý thông tin cá nhân:** Xem lịch sử mua hàng, theo dõi đơn hàng chờ xử lý.

### 3.2. Dành cho Quản trị viên (Admin)
*   **Phân quyền truy cập:** RLS Policy và Route Protection của Next.js chặn người dùng thường vào Admin Dashboard.
*   **Thống kê (Dashboard):** Xem tổng số lượng đơn hàng, số sản phẩm đang bán.
*   **Quản lý Sản phẩm (CRUD):** Thêm/Sửa/Xóa sản phẩm, Upload ảnh sản phẩm lên Supabase Storage tự động lấy URL lưu CSDL.
*   **Quản lý Đơn hàng:** Xem chi tiết đơn hàng, duyệt trạng thái.

---

## 4. ỨNG DỤNG AI TOOL TRONG QUÁ TRÌNH PHÁT TRIỂN

Trong quá trình phát triển, các công cụ AI (GitHub Copilot / ChatGPT) đã được sử dụng tích cực đặc biệt để hỗ trợ migrate (chuyển đổi) dự án từ React/Vite sang Next.js App Router và cấu hình hệ thống:

### Bảng Phụ Lục Các Prompts Đã Thực Hiện

| STT | Tool Sử Dụng | Câu Prompt (Mô tả) | Mục đích / Tại sao dùng | Kết quả đạt được |
|---|---|---|---|---|
| 1 | Copilot / ChatGPT | *"Phân tích dự án React/Vite hiện tại và liệt kê các tiêu chí vi phạm so với yêu cầu dùng Next.js App Router, Supabase, Docker compose."* | Kiểm tra lại source code xem có đi đúng hướng với yêu cầu, nhận diện lỗi dùng custom backend. | AI chỉ ra rõ ràng việc dư thừa thu mục `server/` và project đang ở Vite. Lên plan chuyển đổi. |
| 2 | Copilot / ChatGPT | *"Viết script gỡ bỏ Vite và cài đặt Next.js App Router cho thư mục hiện tại."* | Cần cài Next.js nhanh, chuẩn xác và xoá sạch config Vite cũ (`vite.config.ts`, `index.html`). | Chạy lệnh bỏ Vite thành công, cài Next.js, cập nhật `package.json`. |
| 3 | Copilot / ChatGPT | *"Tạo cấu trúc src/app/layout.tsx và page.tsx cơ bản cho Next.js tích hợp sẵn các file css của Tailwind đã có sẵn ở template cũ."* | Chuyển đổi file HTML sang Next.js App Router, giữ nguyên Root Layout chuẩn không vỡ giao diện. | Root layout được tạo thành công, load các file CSS của Tailwind đầy đủ. |
| 4 | Copilot / ChatGPT | *"Viết file Dockerfile (Multi-stage build) tối ưu cho Next.js để deploy production, kèm docker-compose.yml"* | Phục vụ tiêu chí đóng gói Docker, chuẩn bị release lên VPS/Render. | Tạo ra được Dockerfile build mode `standalone` cực nhẹ và `docker-compose.yml`. |
| 5 | Copilot / ChatGPT | *"Sử dụng supabase-js, viết file khởi tạo Supabase client auth cơ bản để chuẩn bị login."* | Làm nền tảng kết nối Supabase sau khi xoá Express backend cũ. | Tạo file `supabaseClient.js` đọc biến môi trường thành công, hỗ trợ Auth. |

---

## 5. KẾT LUẬN
Dự án FashionShop đã đáp ứng toàn bộ các yêu cầu của môn học "Các công nghệ mới trong phát triển ứng dụng". Việc áp dụng cấu trúc mới với Next.js (App Router), Supabase, Tailwind CSS và đóng gói bằng Docker mang lại một hệ thống hiện đại, dễ bảo trì và có khả năng mở rộng tốt. Ngoài ra, việc tận dụng AI tools đúng cách đã giúp tiết kiệm rất nhiều thời gian trong khâu phân tích lỗi, cấu hình DevOps (Docker) và migrate dự án từ kiến trúc cũ sang kiến trúc mới theo đúng chuẩn đề cương.
