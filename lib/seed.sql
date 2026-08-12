-- 🛍️ CLOTHES SHOP DATABASE SEED DATA (PostgreSQL 16)
-- Bản nạp dữ liệu mẫu hoàn chỉnh phục vụ thử nghiệm và vận hành hệ thống.

-- Xóa dữ liệu cũ để nạp mới (Tuân thủ thứ tự khóa ngoại ngược)
TRUNCATE TABLE cart_items, wishlists, reviews, shipments, payments, order_items, orders, promotions, customer_addresses, customers, inventory, product_variants, product_images, products, colors, brands, categories CASCADE;

-- ============================================================================
-- 1. NẠP DỮ LIỆU DANH MỤC (CATEGORIES)
-- ============================================================================

-- Danh mục cha (Level 1)
INSERT INTO categories (category_id, parent_id, name, slug, description, sort_order) VALUES
('c1000000-0000-0000-0000-000000000000', NULL, 'Áo Nam & Nữ', 'ao-thoi-trang', 'Bộ sưu tập các mẫu áo thời trang nam nữ chất lượng cao', 1),
('c2000000-0000-0000-0000-000000000000', NULL, 'Quần Thời Trang', 'quan-thoi-trang', 'Quần dài, quần short phong cách hiện đại', 2),
('c3000000-0000-0000-0000-000000000000', NULL, 'Váy & Đầm', 'vay-dam', 'Váy thời trang công sở và dạo phố cho phái nữ', 3);

-- Danh mục con (Level 2)
INSERT INTO categories (category_id, parent_id, name, slug, description, sort_order) VALUES
('c1100000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Áo Thun', 'ao-thun', 'Áo thun cotton thoáng mát, co giãn tốt', 1),
('c1200000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Áo Sơ Mi', 'ao-so-mi', 'Áo sơ mi công sở, sơ mi đũi thanh lịch', 2),
('c2100000-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000000', 'Quần Jean', 'quan-jean', 'Quần jean denim cao cấp, bền bỉ', 1),
('c2200000-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000000', 'Quần Tây', 'quan-tay', 'Quần tây âu công sở lịch lãm', 2);

-- ============================================================================
-- 2. NẠP DỮ LIỆU THƯƠNG HIỆU & MÀU SẮC (BRANDS & COLORS)
-- ============================================================================

INSERT INTO brands (brand_id, name, slug, logo_url, description) VALUES
('b1000000-0000-0000-0000-000000000000', 'Uniqlo', 'uniqlo', 'https://example.com/logos/uniqlo.png', 'Thương hiệu thời trang tối giản đến từ Nhật Bản'),
('b2000000-0000-0000-0000-000000000000', 'Zara', 'zara', 'https://example.com/logos/zara.png', 'Thương hiệu thời trang nhanh cao cấp từ Tây Ban Nha');

INSERT INTO colors (color_id, name, hex_code) VALUES
('color000-0000-0000-0000-000000000001', 'Đen', '#000000'),
('color000-0000-0000-0000-000000000002', 'Trắng', '#FFFFFF'),
('color000-0000-0000-0000-000000000003', 'Xanh Navy', '#000080'),
('color000-0000-0000-0000-000000000004', 'Be', '#F5F5DC');

-- ============================================================================
-- 3. NẠP DỮ LIỆU SẢN PHẨM & ẢNH (PRODUCTS & IMAGES)
-- ============================================================================

-- Sản phẩm 1: Áo thun nam Cotton Uniqlo
INSERT INTO products (product_id, category_id, brand_id, name, slug, description, care_instructions, material, base_price, sale_price, sale_start, sale_end, is_featured, meta_title, meta_desc) VALUES
('p1000000-0000-0000-0000-000000000000', 'c1100000-0000-0000-0000-000000000000', 'b1000000-0000-0000-0000-000000000000', 
 'Áo Thun Cotton Cổ Tròn Uniqlo', 'ao-thun-cotton-co-tron-uniqlo', 
 'Áo thun nam cổ tròn làm từ 100% sợi cotton tự nhiên siêu mềm mịn, thấm hút mồ hôi cực tốt. Thiết kế basic phù hợp mặc hằng ngày.', 
 'Giặt máy ở nhiệt độ thường với lưới giặt. Không sấy khô. Ủi ở nhiệt độ trung bình.', 
 '100% Cotton tự nhiên', 299000, 249000, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '30 days', true,
 'Áo Thun Cotton Nam Uniqlo Cổ Tròn Giá Tốt | ClothesShop', 
 'Mua ngay Áo thun cotton cổ tròn Uniqlo chất liệu cotton 100% tự nhiên thoáng mát. Nhiều màu sắc thời trang, size S-XXL. Giao hàng nhanh toàn quốc.');

-- Sản phẩm 2: Áo sơ mi Oxford Zara
INSERT INTO products (product_id, category_id, brand_id, name, slug, description, care_instructions, material, base_price, sale_price, sale_start, sale_end, is_featured, meta_title, meta_desc) VALUES
('p2000000-0000-0000-0000-000000000000', 'c1200000-0000-0000-0000-000000000000', 'b2000000-0000-0000-0000-000000000000', 
 'Áo Sơ Mi Vải Oxford Zara', 'ao-so-mi-oxford-zara', 
 'Áo sơ mi nam oxford thanh lịch, chất vải dày dặn lịch sự, đứng dáng. Thích hợp cho công sở và đi tiệc sang trọng.', 
 'Nên giặt tay hoặc giặt khô. Không dùng chất tẩy mạnh. Ủi hơi nước ở nhiệt độ thích hợp.', 
 'Vải Oxford Premium (80% Cotton, 20% Polyester)', 599000, NULL, NULL, NULL, false,
 'Áo Sơ Mi Nam Oxford Zara Công Sở Lịch Lãm | ClothesShop', 
 'Mua áo sơ mi Oxford Zara nam chất liệu cao cấp, chống nhăn tốt, giữ phom dáng bền lâu. Thích hợp đi làm, đi chơi. Đổi trả dễ dàng.');

-- Nạp ảnh cho Sản phẩm 1
INSERT INTO product_images (product_id, color_id, url, alt_text, sort_order, is_primary) VALUES
('p1000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000001', 'https://example.com/products/tshirt-black-1.jpg', 'Mặt trước áo thun đen Uniqlo', 1, true),
('p1000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000001', 'https://example.com/products/tshirt-black-2.jpg', 'Mặt sau áo thun đen Uniqlo', 2, false),
('p1000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000002', 'https://example.com/products/tshirt-white-1.jpg', 'Mặt trước áo thun trắng Uniqlo', 1, false);

-- Nạp ảnh cho Sản phẩm 2
INSERT INTO product_images (product_id, color_id, url, alt_text, sort_order, is_primary) VALUES
('p2000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000002', 'https://example.com/products/shirt-white-1.jpg', 'Áo sơ mi oxford màu trắng', 1, true),
('p2000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000003', 'https://example.com/products/shirt-blue-1.jpg', 'Áo sơ mi oxford màu xanh navy', 1, false);

-- ============================================================================
-- 4. BIẾN THỂ VÀ TỒN KHO (VARIANTS & INVENTORY)
-- ============================================================================

-- Biến thể Sản phẩm 1 (Áo thun)
INSERT INTO product_variants (variant_id, product_id, color_id, size, sku, price_adjustment, weight) VALUES
('v1100000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000001', 'M', 'TS-UNIQ-COT-BLK-M', 0, 180.00),
('v1100000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000001', 'L', 'TS-UNIQ-COT-BLK-L', 0, 190.00),
('v1100000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000002', 'M', 'TS-UNIQ-COT-WHT-M', 0, 180.00);

-- Biến thể Sản phẩm 2 (Sơ mi)
INSERT INTO product_variants (variant_id, product_id, color_id, size, sku, price_adjustment, weight) VALUES
('v2100000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000002', 'M', 'SH-ZARA-OXF-WHT-M', 0, 250.00),
('v2100000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000002', 'L', 'SH-ZARA-OXF-WHT-L', 0, 270.00),
-- Size XL đắt hơn 20k
('v2100000-0000-0000-0000-000000000003', 'p2000000-0000-0000-0000-000000000000', 'color000-0000-0000-0000-000000000002', 'XL', 'SH-ZARA-OXF-WHT-XL', 20000, 290.00);

-- Nạp dữ liệu Tồn kho (Inventory)
INSERT INTO inventory (variant_id, quantity_on_hand, quantity_reserved, reorder_point) VALUES
('v1100000-0000-0000-0000-000000000001', 100, 0, 10), -- Sẵn hàng
('v1100000-0000-0000-0000-000000000002', 2, 0, 5),   -- Tồn kho thấp (Sắp hết)
('v1100000-0000-0000-0000-000000000003', 0, 0, 10),  -- Hết hàng vật lý

('v2100000-0000-0000-0000-000000000001', 50, 2, 5),  -- Có 2 sản phẩm đang được đặt giữ tạm
('v2100000-0000-0000-0000-000000000002', 80, 0, 5),
('v2100000-0000-0000-0000-000000000003', 30, 0, 5);

-- ============================================================================
-- 5. KHÁCH HÀNG & KHUYẾN MÃI (CUSTOMERS & PROMOTIONS)
-- ============================================================================

-- Khách hàng 1: Hạng Vàng, nhiều điểm tích lũy
INSERT INTO customers (customer_id, email, phone, password_hash, full_name, gender, date_of_birth, tier, loyalty_points, email_verified) VALUES
('cust0000-0000-0000-0000-000000000001', 'nguyenvana@gmail.com', '0901234567', '$2b$12$K.zT0.4W/L.l6V.N4n3e.O0s342fsdfwrwer23453', 'Nguyễn Văn A', 'male', '1995-10-15', 'gold', 1500, true);

-- Khách hàng 2: Hạng Regular mới tạo
INSERT INTO customers (customer_id, email, phone, password_hash, full_name, gender, date_of_birth, tier, loyalty_points, email_verified) VALUES
('cust0000-0000-0000-0000-000000000002', 'tranventhimb@gmail.com', '0987654321', '$2b$12$K.zT0.4W/L.l6V.N4n3e.O0s342fsdfwrwer23454', 'Trần Thị B', 'female', '1998-05-20', 'regular', 0, false);

-- Địa chỉ giao hàng của Khách hàng 1
INSERT INTO customer_addresses (customer_id, full_name, phone, province, district, ward, address_line, is_default) VALUES
('cust0000-0000-0000-0000-000000000001', 'Nguyễn Văn A', '0901234567', 'Thành phố Hà Nội', 'Quận Cầu Giấy', 'Phường Dịch Vọng', 'Số 15, Ngõ 20 Trần Thái Tông', true);

-- Nạp các mã Khuyến mãi (Promotions)
-- Mã giảm giá WELCOME10 giảm 10% tối đa 50k
INSERT INTO promotions (promotion_id, code, name, type, value, min_order_value, max_discount, usage_limit, per_user_limit, start_date, end_date, is_active) VALUES
('prm00000-0000-0000-0000-000000000001', 'WELCOME10', 'Ưu đãi thành viên mới giảm 10%', 'percentage', 10.00, 200000, 50000, 1000, 1, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '90 days', true);

-- Mã giảm giá FREESHIP miễn phí ship cho đơn từ 500k
INSERT INTO promotions (promotion_id, code, name, type, value, min_order_value, max_discount, usage_limit, per_user_limit, start_date, end_date, is_active) VALUES
('prm00000-0000-0000-0000-000000000002', 'FREESHIP500', 'Miễn phí giao hàng cho hóa đơn trên 500k', 'free_shipping', 0.00, 500000, NULL, 5000, 5, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '90 days', true);

-- ============================================================================
-- 6. ĐƠN HÀNG, THANH TOÁN & GIAO VẬN MẪU (ORDERS & TRANSACTIONS)
-- ============================================================================

-- Đơn hàng 1: Khách hàng 1 đã hoàn thành giao dịch (COD)
INSERT INTO orders (order_id, order_number, customer_id, status, payment_status, shipping_name, shipping_phone, shipping_province, shipping_district, shipping_ward, shipping_address, subtotal, discount, shipping_fee, tax, total, points_earned) VALUES
('ord00000-0000-0000-0000-000000000001', '#CS20260812001', 'cust0000-0000-0000-0000-000000000001', 'completed', 'paid', 'Nguyễn Văn A', '0901234567', 'Thành phố Hà Nội', 'Quận Cầu Giấy', 'Phường Dịch Vọng', 'Số 15, Ngõ 20 Trần Thái Tông', 598000, 0, 30000, 0, 628000, 598);

-- Chi tiết đơn hàng 1: Mua 2 Áo thun Cotton màu đen Size M
INSERT INTO order_items (order_id, variant_id, product_name, variant_sku, size, color_name, quantity, unit_price, subtotal) VALUES
('ord00000-0000-0000-0000-000000000001', 'v1100000-0000-0000-0000-000000000001', 'Áo Thun Cotton Cổ Tròn Uniqlo', 'TS-UNIQ-COT-BLK-M', 'M', 'Đen', 2, 299000, 598000);

-- Giao dịch thanh toán cho đơn hàng 1 (Đã thanh toán qua COD)
INSERT INTO payments (order_id, method, amount, status, paid_at) VALUES
('ord00000-0000-0000-0000-000000000001', 'cod', 628000, 'success', CURRENT_TIMESTAMP);

-- Vận chuyển cho đơn hàng 1
INSERT INTO shipments (order_id, carrier, tracking_code, estimated_delivery, actual_delivery, status, cod_amount, shipping_fee) VALUES
('ord00000-0000-0000-0000-000000000001', 'ghtk', 'GHTK8374928374', CURRENT_DATE - 1, CURRENT_TIMESTAMP, 'delivered', 628000, 30000);

-- Nhận xét cho Đơn hàng 1
INSERT INTO reviews (product_id, customer_id, order_item_id, rating, title, content, is_verified_purchase, is_approved) VALUES
('p1000000-0000-0000-0000-000000000000', 'cust0000-0000-0000-0000-000000000001', 
 (SELECT order_item_id FROM order_items WHERE order_id = 'ord00000-0000-0000-0000-000000000001' LIMIT 1), 
 5, 'Vải mặc mát lắm!', 'Chất lượng áo thun Uniqlo khỏi bàn cãi, mặc cực kỳ thoáng mát và vừa vặn dáng người. Sẽ tiếp tục mua ủng hộ shop.', true, true);
