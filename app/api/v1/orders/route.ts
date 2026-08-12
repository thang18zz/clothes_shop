import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/orders
 * Tạo đơn hàng mới với cơ chế Khóa bi quan (Pessimistic Locking - `SELECT FOR UPDATE`)
 * để giữ kho (Reserve Stock) và ngăn ngừa lỗi Race Condition khi tồn kho khả dụng sắp hết.
 */
export async function POST(request: Request) {
  // Sử dụng kết nối Client riêng lẻ từ Pool để quản lý Database Transaction (BEGIN ... COMMIT/ROLLBACK)
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      customerId,
      guestEmail,
      guestPhone,
      shippingName,
      shippingPhone,
      shippingProvince,
      shippingDistrict,
      shippingWard,
      shippingAddress,
      paymentMethod = 'cod',
      couponCode,
      notes,
      items // Mảng các mặt hàng: [{ variantId, quantity }]
    } = body;

    // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Đơn hàng phải chứa ít nhất 1 sản phẩm' },
        { status: 400 }
      );
    }

    if (!shippingName || !shippingPhone || !shippingProvince || !shippingDistrict || !shippingWard || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng' },
        { status: 400 }
      );
    }

    // Bắt đầu Database Transaction
    await client.query('BEGIN');

    let subtotal = 0;
    const orderItemsToInsert: any[] = [];

    // 2. Duyệt qua từng sản phẩm và thực hiện Khóa giữ kho (SELECT FOR UPDATE)
    for (const item of items) {
      const { variantId, quantity } = item;

      if (!variantId || !quantity || quantity <= 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'Bad Request', message: 'Thông tin sản phẩm hoặc số lượng không hợp lệ' },
          { status: 400 }
        );
      }

      // Khóa bản ghi tồn kho tương ứng bằng SELECT FOR UPDATE để loại bỏ Race Condition
      const lockQuery = `
        SELECT 
          v.variant_id,
          v.product_id,
          v.size,
          v.sku,
          v.price_adjustment,
          col.name as color_name,
          p.name as product_name,
          p.base_price,
          p.sale_price,
          inv.quantity_on_hand,
          inv.quantity_reserved,
          (inv.quantity_on_hand - inv.quantity_reserved) as quantity_available
        FROM product_variants v
        INNER JOIN products p ON v.product_id = p.product_id
        INNER JOIN colors col ON v.color_id = col.color_id
        INNER JOIN inventory inv ON v.variant_id = inv.variant_id
        WHERE v.variant_id = $1 AND v.is_active = true AND p.is_active = true
        FOR UPDATE OF inv
      `;

      const { rows: variantRows } = await client.query(lockQuery, [variantId]);

      if (variantRows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'Not Found', message: `Sản phẩm với mã biến thể ${variantId} không tồn tại hoặc đã ngừng bán` },
          { status: 404 }
        );
      }

      const variant = variantRows[0];
      const available = parseInt(variant.quantity_available);

      // Cảnh báo nếu số lượng mua vượt quá tồn kho khả dụng hiện tại
      if (available < quantity) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { 
            success: false, 
            error: 'Out of Stock', 
            message: `Sản phẩm "${variant.product_name}" (${variant.color_name} - Size ${variant.size}) đã hết hàng hoặc không đủ số lượng trong kho (Còn lại: ${available})` 
          },
          { status: 400 }
        );
      }

      // Tính toán giá đơn vị tại thời điểm mua
      const unitPrice = parseFloat(variant.sale_price || variant.base_price) + parseFloat(variant.price_adjustment || 0);
      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      orderItemsToInsert.push({
        variantId: variant.variant_id,
        productName: variant.product_name,
        variantSku: variant.sku,
        size: variant.size,
        colorName: variant.color_name,
        quantity,
        unitPrice,
        subtotal: itemSubtotal
      });

      // Cập nhật tăng số lượng giữ kho (Reserve Stock)
      const reserveQuery = `
        UPDATE inventory 
        SET quantity_reserved = quantity_reserved + $1, last_updated = CURRENT_TIMESTAMP
        WHERE variant_id = $2
      `;
      await client.query(reserveQuery, [quantity, variantId]);
    }

    // 3. Xử lý mã giảm giá Coupon (nếu có)
    let discount = 0;
    let couponId = null;

    if (couponCode) {
      const promoQuery = `
        SELECT promotion_id, type, value, min_order_value, max_discount 
        FROM promotions 
        WHERE code = $1 AND is_active = true AND start_date <= CURRENT_TIMESTAMP AND end_date >= CURRENT_TIMESTAMP
        FOR UPDATE
      `;
      const { rows: promoRows } = await client.query(promoQuery, [couponCode.toUpperCase()]);

      if (promoRows.length > 0) {
        const promo = promoRows[0];
        const minOrder = parseFloat(promo.min_order_value || 0);

        if (subtotal >= minOrder) {
          couponId = promo.promotion_id;
          if (promo.type === 'percentage') {
            discount = (subtotal * parseFloat(promo.value)) / 100;
            if (promo.max_discount) {
              discount = Math.min(discount, parseFloat(promo.max_discount));
            }
          } else if (promo.type === 'fixed_amount') {
            discount = parseFloat(promo.value);
          }

          // Cập nhật số lần mã giảm giá đã được sử dụng
          await client.query(
            `UPDATE promotions SET used_count = used_count + 1 WHERE promotion_id = $1`,
            [couponId]
          );
        }
      }
    }

    // Phí giao hàng mẫu (Miễn phí nếu đơn hàng > 500k)
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // Tạo mã đơn hàng độc nhất dạng #CSYYYYMMDDxxx
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `#CS${dateStr}${randomSuffix}`;

    // 4. Tạo bản ghi đơn hàng trong bảng `orders`
    const insertOrderQuery = `
      INSERT INTO orders (
        order_number, customer_id, guest_email, guest_phone,
        status, payment_status,
        shipping_name, shipping_phone, shipping_province, shipping_district, shipping_ward, shipping_address,
        subtotal, discount, shipping_fee, total, coupon_id, coupon_code, notes
      ) VALUES ($1, $2, $3, $4, 'pending', 'unpaid', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const { rows: orderRows } = await client.query(insertOrderQuery, [
      orderNumber,
      customerId || null,
      guestEmail || null,
      guestPhone || null,
      shippingName,
      shippingPhone,
      shippingProvince,
      shippingDistrict,
      shippingWard,
      shippingAddress,
      subtotal,
      discount,
      shippingFee,
      total,
      couponId,
      couponCode || null,
      notes || null
    ]);

    const createdOrder = orderRows[0];

    // 5. Chèn danh sách mặt hàng vào bảng `order_items`
    for (const item of orderItemsToInsert) {
      const insertItemQuery = `
        INSERT INTO order_items (order_id, variant_id, product_name, variant_sku, size, color_name, quantity, unit_price, subtotal)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await client.query(insertItemQuery, [
        createdOrder.order_id,
        item.variantId,
        item.productName,
        item.variantSku,
        item.size,
        item.colorName,
        item.quantity,
        item.unitPrice,
        item.subtotal
      ]);
    }

    // 6. Khởi tạo bản ghi giao dịch thanh toán trong bảng `payments`
    await client.query(
      `INSERT INTO payments (order_id, method, amount, status) VALUES ($1, $2, $3, 'pending')`,
      [createdOrder.order_id, paymentMethod, total]
    );

    // 7. Xóa giỏ hàng trực tuyến sau khi đặt hàng thành công
    if (customerId) {
      await client.query(`DELETE FROM cart_items WHERE customer_id = $1`, [customerId]);
    }

    // Commit thành công toàn bộ Database Transaction
    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Đặt hàng thành công và giữ kho thành công',
      data: {
        orderId: createdOrder.order_id,
        orderNumber: createdOrder.order_number,
        total: createdOrder.total,
        status: createdOrder.status,
        paymentStatus: createdOrder.payment_status
      }
    });
  } catch (error: any) {
    // Hoàn tác dữ liệu nếu xảy ra lỗi
    await client.query('ROLLBACK');
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  } finally {
    // Giải phóng kết nối client về cho Pool
    client.release();
  }
}
