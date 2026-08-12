import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/v1/admin/reviews
 * Phê duyệt (is_approved), Ẩn đánh giá hoặc Phản hồi đánh giá khách hàng (Admin Moderation)
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { review_id, is_approved, admin_reply } = body;

    if (!review_id) {
      return NextResponse.json({ success: false, error: 'review_id là bắt buộc' }, { status: 400 });
    }

    const updateQuery = `
      UPDATE reviews
      SET 
        is_approved = COALESCE($1, is_approved),
        title = CASE WHEN $2::text IS NOT NULL THEN title || ' | Shop trả lời: ' || $2 ELSE title END,
        updated_at = NOW()
      WHERE review_id = $3
      RETURNING *
    `;

    const { rows } = await dbQuery(updateQuery, [is_approved, admin_reply || null, review_id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đánh giá' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kiểm duyệt đánh giá thành công',
      data: rows[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
