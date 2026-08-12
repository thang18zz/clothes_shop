-- 🛍️ CLOTHES SHOP DATABASE SCHEMA (PostgreSQL 16)
-- Cấu hình toàn bộ cấu trúc cơ sở dữ liệu quan hệ cho hệ thống bán quần áo chuyên nghiệp.

-- Kích hoạt tiện ích tạo UUID tự động
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU ĐẶC BIỆT (ENUMS)
-- ============================================================================

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE customer_tier AS ENUM ('regular', 'silver', 'gold', 'diamond');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'packing', 'shipped', 'delivered', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded', 'partial_refund');
CREATE TYPE payment_method AS ENUM ('cod', 'vnpay', 'momo', 'zalopay', 'card', 'bank_transfer', 'wallet');
CREATE TYPE payment_record_status AS ENUM ('pending', 'success', 'failed', 'refunded', 'partial_refund');
CREATE TYPE shipment_carrier AS ENUM ('ghn', 'ghtk', 'viettel_post', 'jt', 'self');
CREATE TYPE shipment_status AS ENUM ('created', 'picked_up', 'in_transit', 'delivered', 'failed', 'returned');
CREATE TYPE return_item_status AS ENUM ('none', 'requested', 'approved', 'rejected', 'completed');
CREATE TYPE promotion_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y');
CREATE TYPE promotion_target AS ENUM ('all', 'category', 'product', 'brand');

-- ============================================================================
-- 2. ĐỊNH NGHĨA CÁC BẢNG DỮ LIỆU CỐT LÕI
-- ============================================================================

-- Bảng 2.1: Danh mục sản phẩm (Hỗ trợ phân cấp đa tầng bằng Self-Reference)
CREATE TABLE categories (
  category_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id     UUID REFERENCES categories(category_id) ON DELETE SET NULL,
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(120) UNIQUE NOT NULL,
  description   TEXT,
  image_url     VARCHAR(500),
  sort_order    INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2.2: Thương hiệu
CREATE TABLE brands (
  brand_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(120) UNIQUE NOT NULL,
  logo_url    VARCHAR(500),
  description TEXT,
  is_active   BOOLEAN DEFAULT true
);

-- Bảng 2.3: Bảng mã màu sắc sản phẩm
CREATE TABLE colors (
  color_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(50) NOT NULL,     -- Ví dụ: "Đỏ đô", "Xanh navy"
  hex_code   VARCHAR(7) NOT NULL,       -- Ví dụ: "#8B0000"
  is_active  BOOLEAN DEFAULT true
);

-- Bảng 2.4: Sản phẩm gốc (Chứa các thông tin dùng chung cho tất cả biến thể)
CREATE TABLE products (
  product_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
  brand_id     UUID REFERENCES brands(brand_id) ON DELETE SET NULL,
  name         VARCHAR(255) NOT NULL,
  slug         VARCHAR(280) UNIQUE NOT NULL,
  description  TEXT,
  care_instructions TEXT,            -- Hướng dẫn bảo quản
  material     VARCHAR(200),         -- Chất liệu sản phẩm (Ví dụ: 100% Cotton)
  base_price   DECIMAL(12,0) NOT NULL CHECK (base_price >= 0), -- Đơn vị: VND
  sale_price   DECIMAL(12,0) CHECK (sale_price >= 0),
  sale_start   TIMESTAMP WITH TIME ZONE,
  sale_end     TIMESTAMP WITH TIME ZONE,
  is_active    BOOLEAN DEFAULT true,
  is_featured  BOOLEAN DEFAULT false,
  meta_title   VARCHAR(70),          -- Dùng cho SEO tối ưu hóa tìm kiếm
  meta_desc    VARCHAR(160),         -- Dùng cho SEO
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_sale_period CHECK (
    (sale_price IS NULL) OR 
    (sale_price IS NOT NULL AND sale_start IS NOT NULL AND sale_end IS NOT NULL AND sale_start < sale_end)
  )
);

-- Bảng 2.5: Hình ảnh sản phẩm (Có thể liên kết với màu sắc cụ thể của biến thể)
CREATE TABLE product_images (
  image_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  color_id    UUID REFERENCES colors(color_id) ON DELETE SET NULL,
  url         VARCHAR(500) NOT NULL,
  alt_text    VARCHAR(255),
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT false
);

-- Bảng 2.6: Các biến thể của sản phẩm (Size + Màu sắc)
CREATE TABLE product_variants (
  variant_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  color_id          UUID NOT NULL REFERENCES colors(color_id) ON DELETE RESTRICT,
  size              VARCHAR(10) NOT NULL,  -- XS|S|M|L|XL|XXL|2XL|38|40|42...
  sku               VARCHAR(100) UNIQUE NOT NULL,  -- Stock Keeping Unit (Mã định danh kho hàng duy nhất)
  price_adjustment  DECIMAL(12,0) DEFAULT 0,  -- Phần giá trị chênh lệch (cộng hoặc trừ) so với base_price
  weight            DECIMAL(6,2),  -- Đơn vị: gram (sử dụng để tự động tính phí vận chuyển thông qua API)
  is_active         BOOLEAN DEFAULT true,
  UNIQUE(product_id, color_id, size)
);

-- Bảng 2.7: Bảng quản lý tồn kho (Đảm bảo logic giữ kho reserve stock không âm)
CREATE TABLE inventory (
  inventory_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id       UUID NOT NULL UNIQUE REFERENCES product_variants(variant_id) ON DELETE CASCADE,
  quantity_on_hand INT NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0), -- Tồn kho thực tế trong kho vật lý
  quantity_reserved INT NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0), -- Tồn kho đang được giữ tạm thời cho đơn hàng chưa hoàn tất thanh toán
  reorder_point    INT DEFAULT 5,   -- Ngưỡng tồn kho tối thiểu để gửi cảnh báo sắp hết hàng
  last_updated     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Quy tắc cốt lõi: quantity_available = quantity_on_hand - quantity_reserved >= 0
  CONSTRAINT chk_available_inventory CHECK (quantity_on_hand >= quantity_reserved)
);

-- Bảng 2.8: Khách hàng đăng ký tài khoản
CREATE TABLE customers (
  customer_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  phone           VARCHAR(20) UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(200) NOT NULL,
  gender          gender_type,
  date_of_birth   DATE,
  avatar_url      VARCHAR(500),
  tier            customer_tier DEFAULT 'regular',
  loyalty_points  INT DEFAULT 0 CHECK (loyalty_points >= 0),
  is_active       BOOLEAN DEFAULT true,
  email_verified  BOOLEAN DEFAULT false,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login      TIMESTAMP WITH TIME ZONE
);

-- Bảng 2.9: Danh sách các địa chỉ giao hàng của Khách hàng
CREATE TABLE customer_addresses (
  address_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  full_name     VARCHAR(200) NOT NULL,
  phone         VARCHAR(20) NOT NULL,
  province      VARCHAR(100) NOT NULL,
  district      VARCHAR(100) NOT NULL,
  ward          VARCHAR(100) NOT NULL,
  address_line  VARCHAR(500) NOT NULL,  -- Số nhà, ngõ, tên đường
  is_default    BOOLEAN DEFAULT false
);

-- Bảng 2.10: Bảng cấu hình các chương trình khuyến mãi & mã Coupon giảm giá
CREATE TABLE promotions (
  promotion_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code             VARCHAR(50) UNIQUE,  -- NULL đại diện cho việc tự động áp dụng (không cần nhập code)
  name             VARCHAR(200) NOT NULL,
  type             promotion_type NOT NULL,
  value            DECIMAL(10,2) NOT NULL,  -- Có thể là số tiền giảm cố định (VND) hoặc tỷ lệ (%)
  min_order_value  DECIMAL(15,0) DEFAULT 0,  -- Giá trị đơn hàng tối thiểu
  max_discount     DECIMAL(15,0),  -- Giá trị chiết khấu tối đa (áp dụng cho loại giảm giá theo %)
  buy_quantity     INT,            -- Điều kiện cho loại khuyến mãi buy_x_get_y
  get_quantity     INT,
  usage_limit      INT,            -- Giới hạn tổng số lần sử dụng tối đa của mã khuyến mãi
  used_count       INT DEFAULT 0,  -- Số lần mã đã được áp dụng
  per_user_limit   INT DEFAULT 1,  -- Giới hạn lượt dùng tối đa đối với mỗi tài khoản khách hàng
  start_date       TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date         TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active        BOOLEAN DEFAULT true,
  applicable_to    promotion_target DEFAULT 'all',
  target_ids       UUID[],         -- Mảng danh sách các UUID của category/product/brand được áp dụng
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_promo_period CHECK (start_date < end_date)
);

-- Bảng 2.11: Đơn đặt hàng (Lưu thông tin chi tiết đơn hàng & snapshot địa chỉ lúc đặt mua)
CREATE TABLE orders (
  order_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      VARCHAR(20) UNIQUE NOT NULL, -- Định dạng: #CSYYYYMMDDxxx
  customer_id       UUID REFERENCES customers(customer_id) ON DELETE SET NULL,
  guest_email       VARCHAR(255),  -- Lưu thông tin liên lạc đối với khách hàng mua ẩn danh
  guest_phone       VARCHAR(20),
  status            order_status NOT NULL DEFAULT 'pending',
  payment_status    payment_status NOT NULL DEFAULT 'unpaid',
  shipping_name     VARCHAR(200) NOT NULL,
  shipping_phone    VARCHAR(20) NOT NULL,
  shipping_province VARCHAR(100) NOT NULL,
  shipping_district VARCHAR(100) NOT NULL,
  shipping_ward     VARCHAR(100) NOT NULL,
  shipping_address  VARCHAR(500) NOT NULL,
  subtotal          DECIMAL(15,0) NOT NULL CHECK (subtotal >= 0),  -- Tổng tiền gốc trước chiết khấu
  discount          DECIMAL(15,0) DEFAULT 0 CHECK (discount >= 0), -- Số tiền giảm giá được áp dụng
  shipping_fee      DECIMAL(12,0) DEFAULT 0 CHECK (shipping_fee >= 0),
  tax               DECIMAL(12,0) DEFAULT 0 CHECK (tax >= 0),
  total             DECIMAL(15,0) NOT NULL CHECK (total >= 0),     -- Số tiền thanh toán cuối cùng khách thực tế trả
  coupon_id         UUID REFERENCES promotions(promotion_id) ON DELETE RESTRICT,
  coupon_code       VARCHAR(50),      -- Snapshot mã coupon để phục vụ đối soát lịch sử
  points_used       INT DEFAULT 0 CHECK (points_used >= 0),
  points_earned     INT DEFAULT 0 CHECK (points_earned >= 0),
  notes             TEXT,
  cancelled_reason  TEXT,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2.12: Chi tiết các mặt hàng trong hóa đơn mua sắm
CREATE TABLE order_items (
  order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  variant_id    UUID NOT NULL REFERENCES product_variants(variant_id) ON DELETE RESTRICT,
  product_name  VARCHAR(255) NOT NULL,  -- Snapshot tên sản phẩm lúc đặt mua
  variant_sku   VARCHAR(100) NOT NULL,  -- Snapshot SKU biến thể lúc đặt mua
  size          VARCHAR(10) NOT NULL,   -- Snapshot Size
  color_name    VARCHAR(50) NOT NULL,   -- Snapshot Màu sắc
  quantity      INT NOT NULL CHECK (quantity > 0),
  unit_price    DECIMAL(12,0) NOT NULL CHECK (unit_price >= 0), -- Snapshot đơn giá gốc tại thời điểm mua
  subtotal      DECIMAL(15,0) NOT NULL CHECK (subtotal >= 0),   -- subtotal = quantity * unit_price
  return_status return_item_status DEFAULT 'none'
);

-- Bảng 2.13: Giao dịch thanh toán hóa đơn đơn hàng
CREATE TABLE payments (
  payment_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES orders(order_id) ON DELETE RESTRICT,
  method         payment_method NOT NULL,
  amount         DECIMAL(15,0) NOT NULL CHECK (amount >= 0),
  currency       VARCHAR(3) DEFAULT 'VND',
  transaction_id VARCHAR(200),  -- ID đối tác cổng thanh toán trả về (VNPay/MoMo/ZaloPay...)
  gateway_ref    VARCHAR(200),  -- Số tham chiếu của giao dịch
  status         payment_record_status NOT NULL DEFAULT 'pending',
  gateway_data   JSONB,         -- Lưu trữ dữ liệu thô (raw JSON) trả về phục vụ truy vết lỗi
  paid_at        TIMESTAMP WITH TIME ZONE,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2.14: Thông tin vận chuyển đơn đặt hàng
CREATE TABLE shipments (
  shipment_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  carrier            shipment_carrier NOT NULL,
  tracking_code      VARCHAR(100),
  estimated_delivery DATE,
  actual_delivery    TIMESTAMP WITH TIME ZONE,
  weight             DECIMAL(8,2),  -- Tổng trọng lượng của gói hàng (gram)
  cod_amount         DECIMAL(15,0) DEFAULT 0 CHECK (cod_amount >= 0), -- Số tiền thu hộ COD
  shipping_fee       DECIMAL(12,0) CHECK (shipping_fee >= 0),
  status             shipment_status DEFAULT 'created',
  carrier_data       JSONB,         -- Lưu trữ thông báo thô từ đối tác vận chuyển (Webhook logs)
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2.15: Đánh giá sản phẩm của người tiêu dùng
CREATE TABLE reviews (
  review_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id           UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  customer_id          UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  order_item_id        UUID REFERENCES order_items(order_item_id) ON DELETE SET NULL, -- Xác minh hóa đơn mua hàng thực tế
  rating               SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title                VARCHAR(200),
  content              TEXT,
  images               JSONB DEFAULT '[]', -- Danh sách các đường dẫn ảnh đánh giá dạng mảng string JSON
  is_verified_purchase BOOLEAN DEFAULT false, -- verified purchase: TRUE nếu khách hàng thực sự đã mua hàng
  is_approved          BOOLEAN DEFAULT false, -- Phê duyệt bởi Admin để công khai hiển thị
  admin_reply          TEXT,
  admin_reply_at       TIMESTAMP WITH TIME ZONE,
  helpful_count        INT DEFAULT 0 CHECK (helpful_count >= 0),
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2.16: Danh sách sản phẩm yêu thích (Wishlist)
CREATE TABLE wishlists (
  wishlist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, product_id)
);

-- Bảng 2.17: Giỏ hàng trực tuyến (Lưu trữ và đồng bộ hóa giỏ hàng cho tài khoản khách hàng)
CREATE TABLE cart_items (
  cart_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
  session_id   VARCHAR(100),  -- Dùng đối với khách vãng lai chưa đăng nhập
  variant_id   UUID NOT NULL REFERENCES product_variants(variant_id) ON DELETE CASCADE,
  quantity     INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, variant_id),
  UNIQUE(session_id, variant_id),
  CONSTRAINT chk_owner_identity CHECK (
    (customer_id IS NOT NULL AND session_id IS NULL) OR 
    (customer_id IS NULL AND session_id IS NOT NULL)
  )
);

-- ============================================================================
-- 3. KHỞI TẠO CÁC CHỈ MỤC TỐI ƯU HÓA TRUY VẤN (INDEXES)
-- ============================================================================

-- Tối ưu hóa bộ lọc danh mục và thương hiệu của sản phẩm đang hoạt động
CREATE INDEX idx_products_category ON products(category_id) WHERE is_active = true;
CREATE INDEX idx_products_brand ON products(brand_id) WHERE is_active = true;

-- Tối ưu hóa truy vấn các biến thể theo sản phẩm gốc
CREATE INDEX idx_variants_product ON product_variants(product_id);

-- Tối ưu hóa truy vấn tồn kho theo mã biến thể sản phẩm
CREATE INDEX idx_inventory_variant ON inventory(variant_id);

-- Tối ưu hóa tra cứu đơn hàng theo khách hàng
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- Tối ưu hóa truy vấn trạng thái và thời gian đơn hàng (Sắp xếp mới nhất)
CREATE INDEX idx_orders_status ON orders(status, created_at DESC);

-- Tối ưu hóa tra cứu tìm kiếm nhanh mã đơn hàng dạng chuỗi
CREATE INDEX idx_orders_number ON orders(order_number);

-- Tối ưu hóa tải bình luận đánh giá đã phê duyệt cho trang chi tiết sản phẩm
CREATE INDEX idx_reviews_product ON reviews(product_id) WHERE is_approved = true;

-- Hỗ trợ tối ưu tìm kiếm văn bản toàn diện (Full-Text Search) cho sản phẩm theo Tên và Mô tả
CREATE INDEX idx_products_fts ON products 
  USING GIN(to_tsvector('simple', name || ' ' || COALESCE(description, '')));
