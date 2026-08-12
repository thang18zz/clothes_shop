import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/admin/promotions - Tạo chương trình khuyến mãi/mã giảm giá/Flash sale mới (Admin)
 * PUT /api/v1/admin/promotions - Bật/tắt trạng thái khuyến mãi (Admin)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discount_type, discount_value, min_order_value, max_discount_amount, is_active } = body;

    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Mã khuyến mãi, loại chiết khấu và giá trị là bắt buộc' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO promotions (code, discount_type, discount_value, min_order_value, max_discount_amount, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const { rows } = await dbQuery(insertQuery, [
      code,
      discount_type,
      discount_value,
      min_order_value || 0,
      max_discount_amount || null,
      is_active !== undefined ? is_active : true
    ]);

    return NextResponse.json({
      success: true,
      message: 'Khởi tạo chiến dịch khuyến mãi mới thành công',
      data: rows[0]
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
    const { promotion_id, is_active } = body;

    if (!promotion_id || is_active === undefined) {
      return NextResponse.json(
        { success: false, error: 'promotion_id và is_active là bắt buộc' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE promotions SET is_active = $1, updated_at = NOW() WHERE promotion_id = $2 RETURNING *
    `;

    const { rows } = await dbQuery(updateQuery, [is_active, promotion_id]);

    return NextResponse.json({
      success: true,
      message: `Cập nhật trạng thái khuyến mãi thành công (${is_active ? 'Kích hoạt' : 'Tắt'})`,
      data: rows[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
