import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/promotions/bundles
 * Lấy danh sách các gói Combo sản phẩm (Bundle Promotions - ví dụ: Bộ Áo + Quần ưu đãi)
 */
export async function GET() {
  try {
    const bundlesQuery = `
      SELECT 
        p.promotion_id as bundle_id,
        p.code as bundle_code,
        p.description as bundle_name,
        p.discount_type,
        p.discount_value,
        p.min_order_value,
        p.is_active
      FROM promotions p
      WHERE p.is_active = true AND p.discount_type IN ('fixed_amount', 'percentage')
      ORDER BY p.discount_value DESC
    `;

    const { rows: bundles } = await dbQuery(bundlesQuery);

    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách Combo/Bundle ưu đãi thành công',
      data: bundles
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
