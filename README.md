  # Fashion Ecommerce Website
  
  https://jkhoa.github.io/Website_TMDT_BanQuanAo/

  ## Running the code

  1.  **Backend**: Trong thư mục `server`, chạy `npm run dev` (Cổng 3001)
  2.  **Frontend**: Trrong thư mục gốc, chạy `npm run dev` (Cổng 5173 hoặc 5174)

  ## Dong bo localhost va GitHub Pages

  Ban localhost dang goi API tai `http://localhost:3001/api`.
  De website tren GitHub Pages giong local, can cau hinh backend public va truyen URL API qua bien:

  1. Vao GitHub repo -> Settings -> Secrets and variables -> Actions -> Variables.
  2. Tao bien `VITE_API_BASE_URL` (vi du: `https://your-backend-domain/api`).
  3. Push lai len nhanh `main` de workflow build/deploy lai Pages.

  Neu khong set bien nay, frontend se mac dinh goi localhost.

  ## Tài khoản mặc định (Default Accounts)

  ### 🔑 Admin
  - **Email**: `admin@fashionshop.vn`
  - **Password**: `Admin123!`

  ### 👤 Customer
  - **Email**: `customer@example.com`
  - **Password**: `Customer123!`
