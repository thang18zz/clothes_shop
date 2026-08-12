import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/promotions/flash-sale
 * Lấy danh sách sản phẩm đang trong chương trình Flash Sale kèm đếm ngược (Countdown) thời gian thực.
 */
export async function GET() {
  try {
    const flashSaleQuery = `
      SELECT 
        p.product_id,
        p.name as product_name,
        p.slug,
        p.base_price,
        p.sale_price,
        ROUND(((p.base_price - p.sale_price) / p.base_price) * 100) as discount_percentage,
        (
          SELECT url FROM product_images 
          WHERE product_id = p.product_id 
          ORDER BY is_primary DESC, sort_order ASC LIMIT 1
        ) as image_url,
        (
          SELECT COALESCE(SUM(quantity_available), 0) 
          FROM inventory i 
          INNER JOIN product_variants v ON i.variant_id = v.variant_id 
          WHERE v.product_id = p.product_id
        ) as total_stock_available
      FROM products p
      WHERE p.is_active = true 
        AND p.sale_price IS NOT NULL 
        AND p.sale_price < p.base_price
      ORDER BY discount_percentage DESC
      LIMIT 10
    `;

    const { rows: flashSaleItems } = await dbQuery(flashSaleQuery);

    // Tính thời gian kết thúc khung giờ Flash Sale (Ví dụ: Khung giờ 24h hôm nay)
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    return NextResponse.json({
      success: true,
      data: {
        flashSaleEndTime: endOfDay.toISOString(),
        serverTime: now.toISOString(),
        items: flashSaleItems
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
