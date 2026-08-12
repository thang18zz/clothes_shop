import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { pool, dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/payments
 * Khởi tạo liên kết thanh toán (Redirect URL) tới các cổng thanh toán (VNPay / MoMo / ZaloPay)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, method } = body;

    if (!orderId || !method) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Thiếu thông số orderId hoặc method' },
        { status: 400 }
      );
    }

    // 1. Kiểm tra sự tồn tại của đơn hàng
    const orderQuery = `SELECT order_id, order_number, total, payment_status, status FROM orders WHERE order_id = $1`;
    const { rows: orderRows } = await dbQuery(orderQuery, [orderId]);

    if (orderRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Not Found', message: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    const order = orderRows[0];

    if (order.payment_status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Đơn hàng này đã được thanh toán trước đó' },
        { status: 400 }
      );
    }

    // 2. Giả lập sinh URL chuyển hướng cổng thanh toán Sandbox (VNPay / MoMo / ZaloPay)
    const secretKey = process.env.PAYMENT_SECRET_KEY || 'clothes_shop_secret_key_2026';
    const txnRef = `${order.order_number}_${Date.now()}`;
    const amount = Math.round(parseFloat(order.total));

    // Tạo chữ ký HMAC SHA512 bảo mật
    const signData = `amount=${amount}&orderId=${order.order_id}&txnRef=${txnRef}`;
    const hmac = crypto.createHmac('sha512', secretKey);
    const signature = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Lưu thông tin mã giao dịch cổng thanh toán vào bảng `payments`
    await dbQuery(
      `UPDATE payments SET transaction_id = $1, method = $2, updated_at = CURRENT_TIMESTAMP WHERE order_id = $3`,
      [txnRef, method, order.order_id]
    );

    const redirectUrl = `/checkout/payment-gateway?txnRef=${txnRef}&amount=${amount}&signature=${signature}&method=${method}`;

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.order_id,
        txnRef,
        amount,
        paymentMethod: method,
        paymentUrl: redirectUrl
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/payments (IPN Webhook Callback)
 * Xử lý thông báo thanh toán tức thì (Instant Payment Notification - Webhook IPN)
 * Thực hiện xác thực chữ ký HMAC SHA512, Idempotency và trừ kho vật lý thực tế.
 */
export async function PUT(request: Request) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { txnRef, orderId, amount, status, signature, idempotencyKey } = body;

    // 1. Kiểm tra chữ ký HMAC SHA512 chống giả mạo Webhook IPN
    const secretKey = process.env.PAYMENT_SECRET_KEY || 'clothes_shop_secret_key_2026';
    const signData = `amount=${amount}&orderId=${orderId}&txnRef=${txnRef}`;
    const expectedSignature = crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Chữ ký chữ ký số HMAC không hợp lệ!' },
        { status: 401 }
      );
    }

    await client.query('BEGIN');

    // 2. Kiểm tra tính Idempotency: Giao dịch đã được xử lý thành công trước đó chưa
    const paymentCheckQuery = `
      SELECT payment_id, status, order_id 
      FROM payments 
      WHERE transaction_id = $1 
      FOR UPDATE
    `;
    const { rows: paymentRows } = await client.query(paymentCheckQuery, [txnRef]);

    if (paymentRows.length > 0 && paymentRows[0].status === 'completed') {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: true,
        message: 'Idempotency Alert: Webhook giao dịch này đã được xử lý trước đó.'
      });
    }

    if (status === 'SUCCESS') {
      // A. Cập nhật trạng thái bảng `payments`
      await client.query(
        `UPDATE payments SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE transaction_id = $1`,
        [txnRef]
      );

      // B. Cập nhật trạng thái bảng `orders` sang Paid & Confirmed
      await client.query(
        `UPDATE orders SET payment_status = 'paid', status = 'confirmed', updated_at = CURRENT_TIMESTAMP WHERE order_id = $1`,
        [orderId]
      );

      // C. Trừ kho vật lý thực tế: Trừ `quantity_on_hand` và giải phóng `quantity_reserved`
      const orderItemsQuery = `SELECT variant_id, quantity FROM order_items WHERE order_id = $1`;
      const { rows: items } = await client.query(orderItemsQuery, [orderId]);

      for (const item of items) {
        const deductStockQuery = `
          UPDATE inventory 
          SET 
            quantity_on_hand = quantity_on_hand - $1,
            quantity_reserved = quantity_reserved - $1,
            last_updated = CURRENT_TIMESTAMP
          WHERE variant_id = $2
        `;
        await client.query(deductStockQuery, [item.quantity, item.variant_id]);
      }
    } else {
      // Nếu giao dịch thất bại/hủy thanh toán trực tuyến:
      await client.query(
        `UPDATE payments SET status = 'failed', updated_at = CURRENT_TIMESTAMP WHERE transaction_id = $1`,
        [txnRef]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Xử lý Webhook IPN và cập nhật trạng thái kho thành công'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
