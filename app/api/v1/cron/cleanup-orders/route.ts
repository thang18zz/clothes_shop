import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/cron/cleanup-orders
 * Cron Job chạy định kỳ 15 phút: Quét và dọn dẹp các đơn hàng quá hạn thanh toán (> 15 phút),
 * tự động giải phóng lượng tồn kho đang tạm giữ (quantity_reserved) trả về cho kho khả dụng.
 */
export async function GET(request: Request) {
  // Xác thực bí mật CRON_SECRET để chỉ cho phép máy chủ/cron runner gọi endpoint này
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET || 'clothes_shop_cron_secret_2026';

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', message: 'Mã bí mật Cron Job không hợp lệ' },
      { status: 401 }
    );
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Quét các đơn hàng `pending` và `unpaid` đã tạo quá 15 phút
    const timeoutMinutes = 15;
    const findExpiredOrdersQuery = `
      SELECT order_id, order_number, created_at
      FROM orders
      WHERE status = 'pending' 
        AND payment_status = 'unpaid' 
        AND created_at < CURRENT_TIMESTAMP - INTERVAL '${timeoutMinutes} minutes'
      FOR UPDATE
    `;

    const { rows: expiredOrders } = await client.query(findExpiredOrdersQuery);

    if (expiredOrders.length === 0) {
      await client.query('COMMIT');
      return NextResponse.json({
        success: true,
        message: 'Không có đơn hàng nào quá hạn cần dọn dẹp',
        processedCount: 0
      });
    }

    let releasedItemCount = 0;

    // 2. Duyệt qua từng đơn hàng bị hết hạn và giải phóng tồn kho đang tạm giữ
    for (const order of expiredOrders) {
      // A. Lấy danh sách các mặt hàng trong đơn
      const getItemsQuery = `SELECT variant_id, quantity FROM order_items WHERE order_id = $1`;
      const { rows: items } = await client.query(getItemsQuery, [order.order_id]);

      // B. Giảm quantity_reserved của từng biến thể
      for (const item of items) {
        const releaseStockQuery = `
          UPDATE inventory 
          SET quantity_reserved = GREATEST(0, quantity_reserved - $1), last_updated = CURRENT_TIMESTAMP
          WHERE variant_id = $2
        `;
        await client.query(releaseStockQuery, [item.quantity, item.variant_id]);
        releasedItemCount += item.quantity;
      }

      // C. Cập nhật trạng thái đơn hàng sang Bị Hủy (`cancelled`)
      await client.query(
        `UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE order_id = $1`,
        [order.order_id]
      );

      // D. Cập nhật trạng thái giao dịch thanh toán tương ứng sang Thất Bại (`failed`)
      await client.query(
        `UPDATE payments SET status = 'failed', updated_at = CURRENT_TIMESTAMP WHERE order_id = $1 AND status = 'pending'`,
        [order.order_id]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: `Đã dọn dẹp và giải phóng kho thành công cho ${expiredOrders.length} đơn hàng quá hạn`,
      data: {
        cancelledOrdersCount: expiredOrders.length,
        releasedItemCount,
        orders: expiredOrders.map(o => o.order_number)
      }
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
