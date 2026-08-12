# 🛍️ CLOTHES SHOP — E-COMMERCE PLATFORM

> Website thương mại điện tử bán quần áo thời trang cao cấp, tối ưu trải nghiệm mua sắm (UX), chuẩn SEO, tích hợp cơ sở dữ liệu PostgreSQL 16 và hệ thống API xử lý giữ kho thời gian thực.

---

## 🌟 ĐẮC ĐIỂM NỔI BẬT (KEY FEATURES)

### 🎨 Frontend & UI/UX
- **Kiến trúc Next.js 14 (App Router)**: Tối ưu hóa SEO với Server-Side Rendering (SSR) & Static Site Generation (SSG).
- **Anti-Fixation Design System**: Thiết kế giao diện hiện đại, tối giản, chuẩn responsive trên Mobile, Tablet và Desktop.
- **Giỏ Hàng & Mã Giảm Giá**: Quản lý trạng thái bằng Zustand, áp dụng mã coupon instant (`WELCOME10`, `FREESHIP500`).
- **Phân Loại & Bộ Lọc Nâng Cao**: Lọc theo danh mục đa tầng, thương hiệu, mức giá, kích cỡ (XS - 2XL) và màu sắc.

### ⚡ Backend & Cơ Sở Dữ Liệu
- **PostgreSQL 16 High-Performance**: 17 bảng dữ liệu quan hệ, 10 kiểu ENUM, 8 chỉ mục (gồm chỉ mục GIN hỗ trợ Full-Text Search).
- **Chống Race Condition Tồn Kho**: Sử dụng giao dịch cơ sở dữ liệu (Database Transaction) kết hợp **Khóa bi quan (`SELECT FOR UPDATE`)** để khóa giữ kho (`quantity_reserved`) khi khách hàng đặt đơn.
- **Thanh Toán & Webhook IPN**: Tích hợp các cổng thanh toán (VNPay, MoMo, ZaloPay), xác thực chữ ký bảo mật **HMAC-SHA512** và cơ chế **Idempotency Key** chống xử lý trùng lặp giao dịch.
- **Tầng Bảo Mật Auth (JWT)**: Đăng ký/đăng nhập với mật khẩu được mã hóa bằng `bcryptjs`, quản lý Access Token (15 phút) và Refresh Token (30 ngày) trong Cookie `HttpOnly` với cơ chế **Refresh Token Rotation**.
- **Hệ Thống Cron Jobs Tự Động**: 
  - Tự động dọn dẹp các đơn hàng quá hạn thanh toán (> 15 phút) và giải phóng kho giữ tạm thời.
  - Tự động quét chi tiêu 12 tháng gần nhất để nâng phân hạng thành viên Loyalty (Silver $\ge$ 5tr, Gold $\ge$ 15tr, Diamond $\ge$ 30tr).

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide React, Zustand
- **Backend API**: Next.js API Route Handlers, Node.js, `pg` (PostgreSQL client pool)
- **Database**: PostgreSQL 16
- **Security**: JWT (JSON Web Tokens), `bcryptjs`, HMAC SHA-512, Cookie `HttpOnly`
- **Tooling & Quality**: ESLint (`next/core-web-vitals`), Git

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN CỤC BỘ (LOCAL DEVELOPMENT)

### 1. Yêu Cầu Tiền Đề (Prerequisites)
- **Node.js**: phiên bản `>= 18.17.0`
- **npm** hoặc **yarn** / **pnpm**
- **PostgreSQL 16**: Đang chạy trên máy cục bộ hoặc Docker container (Default port: `5432`).

### 2. Cài Đặt Mã Nguồn
```bash
# Clone dự án từ GitHub
git clone https://github.com/thang18zz/clothes_shop.git
cd clothes_shop

# Cài đặt các gói phụ thuộc (Dependencies)
npm install
```

### 3. Cấu Hình Biến Môi Trường (Environment Variables)
Tạo tệp `.env.local` tại thư mục gốc của dự án với nội dung mẫu sau:

```env
# Database Connection URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/clothes_shop

# Authentication Security
JWT_SECRET=clothes_shop_jwt_secret_key_2026
JWT_REFRESH_SECRET=clothes_shop_jwt_refresh_secret_2026

# Payment Gateway Secret Key
PAYMENT_SECRET_KEY=clothes_shop_secret_key_2026

# Cron Job Secret Authorization Key
CRON_SECRET=clothes_shop_cron_secret_2026
```

### 4. Khởi Tạo Cơ Sở Dữ Liệu PostgreSQL
Mở terminal và thực thi các tệp DDL Schema và Seed Data đã chuẩn bị sẵn trong thư mục `lib/`:

```powershell
# BƯỚC 1: Khởi tạo database clothes_shop trong psql
psql -U postgres -c "CREATE DATABASE clothes_shop;"

# BƯỚC 2: Khởi tạo cấu trúc 17 bảng DDL Schema
psql -U postgres -d clothes_shop -f lib/schema.sql

# BƯỚC 3: Nạp dữ liệu thử nghiệm mẫu (Seed Data)
psql -U postgres -d clothes_shop -f lib/seed.sql
```

### 5. Khởi Chạy Server Phát Triển
```bash
npm run dev
```
Mở trình duyệt và truy cập: **`http://localhost:3000`**

---

## 📦 HƯỚNG DẪN KHỞI TẠO BẢN BUILD PRODUCTION

Để kiểm tra tính hợp lệ của mã nguồn và đóng gói sản phẩm cho môi trường Production:

```bash
# 1. Kiểm tra Linting tĩnh
npm run lint

# 2. Biên dịch bản Build Production
npm run build

# 3. Khởi chạy máy chủ Production
npm run start
```

---

## 🌐 HƯỚNG DẪN TRIỂN KHAI (DEPLOYMENT)

### Triển khai lên Vercel / Cloudflare Pages / Railway
1. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete backend APIs, database schema and cron jobs"
   git push origin main
   ```
2. **Liên kết với Vercel**:
   - Truy cập [Vercel Dashboard](https://vercel.com/) $\rightarrow$ **Add New Project** $\rightarrow$ Chọn repository `clothes_shop`.
   - Cấu hình các biến môi trường (`DATABASE_URL`, `JWT_SECRET`, `PAYMENT_SECRET_KEY`, `CRON_SECRET`) trong mục **Environment Variables**.
   - Bấm **Deploy**.
3. **Cấu hình Cron Job trên Vercel**:
   - Vercel sẽ tự động phát hiện các API trong `/api/v1/cron/...` để chạy các tác vụ dọn kho và nâng hạng thành viên tự động.

---

## 📌 CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT STRUCTURE)

```
clothes_shop/
├── app/                        # Next.js 14 App Router
│   ├── api/v1/                 # RESTful API Endpoints
│   │   ├── auth/               # Auth API (Register, Login, Refresh, Logout)
│   │   ├── cart/               # Cart API (GET, POST, DELETE)
│   │   ├── cron/               # Cron Jobs (cleanup-orders, loyalty-tiers)
│   │   ├── orders/             # Orders API (SELECT FOR UPDATE Stock Lock)
│   │   ├── payments/           # Payments & Webhook IPN API (HMAC SHA512)
│   │   └── products/           # Products API (Filter, Sort, Full-Text Search)
│   ├── checkout/               # Trang Thanh toán Multi-step
│   ├── products/               # Trang Danh sách & Chi tiết Sản phẩm (PDP)
│   ├── globals.css             # Design System Tokens & Global Styles
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Trang chủ (Homepage)
├── lib/                        # Thư viện & Cấu hình Database
│   ├── db.ts                   # PostgreSQL Connection Pool Client
│   ├── schema.sql              # PostgreSQL DDL Migration (17 Tables)
│   ├── seed.sql                # Seed Data (Categories, Products, Inventory, Orders)
│   ├── types.ts                # TypeScript Interfaces & Definitions
│   └── useCart.ts              # Zustand Cart Store
├── public/                     # Tài nguyên tĩnh (Images, Icons)
├── .eslintrc.json              # Cấu hình ESLint
├── next.config.js              # Cấu hình Next.js
├── package.json                # Quản lý thư viện & npm scripts
└── README.md                   # Tài liệu hướng dẫn dự án
```

---

## 📄 GIẤY PHÉP (LICENSE)
Dự án được phát hành theo giấy phép [MIT License](LICENSE).
