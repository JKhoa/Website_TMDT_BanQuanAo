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

  ## Deploy backend (Render / Railway)

  Da co san file cau hinh:
  - `render.yaml` (deploy Render)
  - `railway.toml` (deploy Railway)
  - `server/Dockerfile`

  ### Cach nhanh voi Render
  1. Dang nhap Render, chon New + -> Blueprint.
  2. Chon repo nay, Render se doc `render.yaml` va tao service backend.
  3. Sau khi deploy xong, copy URL backend (vi du: `https://fashionshop-api.onrender.com/api`).
  4. Vao GitHub repo -> Settings -> Secrets and variables -> Actions -> Variables.
  5. Tao/Cap nhat `VITE_API_BASE_URL` = URL backend + `/api`.
  6. Push 1 commit moi de GitHub Pages build lai frontend.

  ### Bien moi truong backend toi thieu
  - `NODE_ENV=production`
  - `PORT=3001`
  - `DB_DIALECT=sqlite` (hoac postgres/mysql)
  - `DB_STORAGE=/opt/render/project/src/server-data/database.sqlite` (neu sqlite)
  - `FRONTEND_URLS=https://jkhoa.github.io`
  - `JWT_SECRET`, `JWT_REFRESH_SECRET`

  ## Tài khoản mặc định (Default Accounts)

  ### 🔑 Admin
  - **Email**: `admin@fashionshop.vn`
  - **Password**: `Admin123!`

  ### 👤 Customer
  - **Email**: `customer@example.com`
  - **Password**: `Customer123!`
