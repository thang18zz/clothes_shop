import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/wishlist
 * Lấy danh sách sản phẩm yêu thích của khách hàng.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Thiếu tham số customerId' },
        { status: 400 }
      );
    }

    const wishlistQuery = `
      SELECT 
        w.wishlist_id,
        w.created_at,
        p.product_id,
        p.name as product_name,
        p.slug as product_slug,
        p.base_price,
        p.sale_price,
        (
          SELECT url FROM product_images 
          WHERE product_id = p.product_id 
          ORDER BY is_primary DESC, sort_order ASC LIMIT 1
        ) as image_url
      FROM wishlists w
      INNER JOIN products p ON w.product_id = p.product_id
      WHERE w.customer_id = $1
      ORDER BY w.created_at DESC
    `;

    const { rows: wishlistItems } = await dbQuery(wishlistQuery, [customerId]);

    return NextResponse.json({ success: true, data: wishlistItems });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/wishlist
 * Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích (Toggle Wishlist).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, productId } = body;

    if (!customerId || !productId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Vui lòng cung cấp customerId và productId' },
        { status: 400 }
      );
    }

    // Kiểm tra xem sản phẩm đã có trong wishlist chưa
    const checkQuery = `SELECT wishlist_id FROM wishlists WHERE customer_id = $1 AND product_id = $2`;
    const { rows: checkRows } = await dbQuery(checkQuery, [customerId, productId]);

    if (checkRows.length > 0) {
      // Nếu đã có -> Xóa khỏi wishlist (Toggle OFF)
      await dbQuery(`DELETE FROM wishlists WHERE wishlist_id = $1`, [checkRows[0].wishlist_id]);
      return NextResponse.json({
        success: true,
        action: 'removed',
        message: 'Đã xóa sản phẩm khỏi danh sách yêu thích'
      });
    } else {
      // Nếu chưa có -> Thêm vào wishlist (Toggle ON)
      const insertQuery = `INSERT INTO wishlists (customer_id, product_id) VALUES ($1, $2) RETURNING *`;
      const { rows: inserted } = await dbQuery(insertQuery, [customerId, productId]);
      return NextResponse.json({
        success: true,
        action: 'added',
        message: 'Đã thêm sản phẩm vào danh sách yêu thích',
        data: inserted[0]
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
