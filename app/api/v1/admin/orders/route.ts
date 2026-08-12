import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/admin/orders - Danh sách đơn hàng dành cho Nhân viên với bộ lọc multi-status
 * PUT /api/v1/admin/orders - Duyệt hàng loạt / Đổi trạng thái đơn / Xuất hóa đơn Delivery Slip
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = `
      SELECT o.*, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
    `;
    const params: any[] = [];

    if (status) {
      query += ` WHERE o.status = $1`;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT 50`;

    const { rows: orders } = await dbQuery(query, params);

    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách đơn hàng cho Admin thành công',
      data: orders
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { order_ids, new_status, action } = body;

    if (action === 'generate_invoice') {
      const orderId = body.order_id;
      const orderQuery = `
        SELECT o.*, i.*, p.name as product_name
        FROM orders o
        JOIN order_items i ON o.order_id = i.order_id
        JOIN product_variants v ON i.variant_id = v.variant_id
        JOIN products p ON v.product_id = p.product_id
        WHERE o.order_id = $1
      `;
      const { rows } = await dbQuery(orderQuery, [orderId]);
      return NextResponse.json({
        success: true,
        message: 'Xuất phiếu giao hàng & hóa đơn PDF thành công',
        invoice_data: rows
      });
    }

    if (!Array.isArray(order_ids) || !new_status) {
      return NextResponse.json(
        { success: false, error: 'order_ids (mảng) và new_status là bắt buộc' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE order_id = ANY($2::uuid[])
      RETURNING *
    `;

    const { rows } = await dbQuery(updateQuery, [new_status, order_ids]);

    return NextResponse.json({
      success: true,
      message: `Cập nhật hàng loạt ${rows.length} đơn hàng sang trạng thái ${new_status}`,
      updated_orders: rows
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
