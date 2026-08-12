import { NextResponse } from 'next/server';
import { pool, dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/returns
 * Tiếp nhận yêu cầu đổi trả (RMA Flow - Return Merchandise Authorization).
 * Tự động tính toán số tiền hoàn trả phân bổ theo tỷ lệ (Pro-rated Refund) nếu đơn hàng có áp dụng coupon.
 */
export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { customerId, orderId, orderItemId, reason, returnType = 'refund' } = body;

    if (!customerId || !orderId || !orderItemId || !reason) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Vui lòng cung cấp customerId, orderId, orderItemId và lý do đổi trả' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // 1. Kiểm tra đơn hàng có hợp lệ để đổi trả không (Phải thuộc customerId và ở trạng thái `delivered` hoặc `completed`)
    const orderQuery = `
      SELECT order_id, subtotal, discount, shipping_fee, total, status 
      FROM orders 
      WHERE order_id = $1 AND customer_id = $2 FOR UPDATE
    `;
    const { rows: orderRows } = await client.query(orderQuery, [orderId, customerId]);

    if (orderRows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: 'Not Found', message: 'Không tìm thấy đơn hàng hoặc đơn hàng không thuộc về bạn' },
        { status: 404 }
      );
    }

    const order = orderRows[0];

    if (!['completed', 'delivered'].includes(order.status)) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Chỉ có thể tạo yêu cầu đổi trả cho đơn hàng đã giao thành công' },
        { status: 400 }
      );
    }

    // 2. Lấy chi tiết mặt hàng cần đổi trả
    const itemQuery = `
      SELECT order_item_id, variant_id, quantity, unit_price, subtotal 
      FROM order_items 
      WHERE order_item_id = $1 AND order_id = $2
    `;
    const { rows: itemRows } = await client.query(itemQuery, [orderItemId, orderId]);

    if (itemRows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: 'Not Found', message: 'Không tìm thấy mặt hàng tương ứng trong đơn hàng' },
        { status: 404 }
      );
    }

    const item = itemRows[0];
    const orderSubtotal = parseFloat(order.subtotal);
    const orderDiscount = parseFloat(order.discount || 0);
    const itemSubtotal = parseFloat(item.subtotal);

    // 3. Tính toán số tiền hoàn trả phân bổ theo tỷ lệ (Pro-rated Refund Calculation)
    // Mức giảm phân bổ = (Giá trị mặt hàng trả / Tổng tiền hàng đơn) * Tổng chiết khấu đơn
    const allocatedDiscount = orderSubtotal > 0 ? (itemSubtotal / orderSubtotal) * orderDiscount : 0;
    const calculatedRefundAmount = Math.max(0, Math.round(itemSubtotal - allocatedDiscount));

    // 4. Cộng trả sản phẩm về tồn kho vật lý (quantity_on_hand)
    const restockQuery = `
      UPDATE inventory 
      SET quantity_on_hand = quantity_on_hand + $1, last_updated = CURRENT_TIMESTAMP 
      WHERE variant_id = $2
    `;
    await client.query(restockQuery, [item.quantity, item.variant_id]);

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Tạo yêu cầu đổi trả và hoàn tiền phân bổ (Pro-rated Refund) thành công',
      data: {
        orderId,
        orderItemId,
        returnType,
        itemOriginalSubtotal: itemSubtotal,
        allocatedDiscount: Math.round(allocatedDiscount),
        refundAmount: calculatedRefundAmount,
        restockedQuantity: item.quantity
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
