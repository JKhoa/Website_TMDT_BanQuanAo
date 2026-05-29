# Bảng phụ lục các prompts AI đã thực hiện

| STT | Prompt đã sử dụng | Công cụ AI | Mục đích / Giải thích lý do dùng | Kết quả nhận được và áp dụng |
|---|---|---|---|---|
| 1 | "Phân tích dự án React/Vite hiện tại và liệt kê các tiêu chí vi phạm so với yêu cầu dùng Next.js App Router, Supabase, Docker compose." | GitHub Copilot / ChatGPT | Kiểm tra lại toàn bộ source code xem có đi đúng hướng với yêu cầu của giảng viên hay không. Nhận diện lỗi sử dụng custom backend. | AI chỉ ra rõ ràng việc dư thừa thu mục `server/` (dùng Express) và việc project đang ở Vite. Bắt đầu lên plan chuyển đổi. |
| 2 | "Viết script gỡ bỏ Vite và cài đặt Next.js App Router cho thư mục hiện tại." | GitHub Copilot / ChatGPT | Cần cài Next.js nhanh chóng chuẩn xác và remove sạch các config cũ của Vite (vite.config.ts, index.html) | Chạy thành công lệnh bỏ Vite, cài `next`, `react`, cập nhật `package.json` sang dev next. |
| 3 | "Tạo cấu trúc src/app/layout.tsx và page.tsx cơ bản cho Next.js tích hợp sẵn các file css của Tailwind đã có sẵn ở template cũ." | GitHub Copilot / ChatGPT | Do chuyển đổi từ Vite index.html vào Next.js, cần cấu hình lại Root Layout chuẩn để không vỡ giao diện. | Root layout được tạo thành công, load các file `index.css`, `tailwind.css` từ thư mục styles. |
| 4 | "Viết file Dockerfile (Multi-stage build) tối ưu cho Next.js để deploy production, kèm docker-compose.yml" | GitHub Copilot / ChatGPT | Phục vụ tiêu chí số 3: Containerization bằng Docker, chuẩn bị release lên VPS. | Tạo ra được Dockerfile build mode `standalone` cực nhẹ, chạy trơn tru với port 3000 và file docker-compose. |
| 5 | "Sử dụng supabase-js, viết file khởi tạo Supabase client auth cơ bản để chuẩn bị login." | GitHub Copilot / ChatGPT | Làm nền tảng kết nối backend Supabase sau khi xoá Express backend cũ. | Tạo file `supabaseClient.js` đọc biến môi trường từ `.env` thành công. |

*Ghi chú thêm:* Các prompts này chủ yếu nhằm mục đích setup Framework mới, migrate code và tối ưu hoá luồng deploy theo tiêu chí đề bài. Toàn bộ logic Components UI và Custom CSS được giữ lại từ code gốc để đảm bảo nguyên vẹn giao diện.
