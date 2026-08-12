import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/reviews
 * Lấy danh sách đánh giá sản phẩm đã được phê duyệt (is_approved = true)
 * kèm điểm đánh giá trung bình và phân bổ số sao.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Thiếu tham số productId' },
        { status: 400 }
      );
    }

    // Truy vấn danh sách đánh giá công khai
    const reviewsQuery = `
      SELECT 
        r.review_id,
        r.rating,
        r.title,
        r.content,
        r.images,
        r.is_verified_purchase,
        r.created_at,
        c.full_name as reviewer_name
      FROM reviews r
      INNER JOIN customers c ON r.customer_id = c.customer_id
      WHERE r.product_id = $1 AND r.is_approved = true
      ORDER BY r.created_at DESC
    `;
    const { rows: reviews } = await dbQuery(reviewsQuery, [productId]);

    // Tính điểm đánh giá trung bình và phân bổ số sao
    const statsQuery = `
      SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as star_5,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as star_4,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as star_3,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as star_2,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as star_1
      FROM reviews
      WHERE product_id = $1 AND is_approved = true
    `;
    const { rows: statsRows } = await dbQuery(statsQuery, [productId]);
    const stats = statsRows[0];

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        stats: {
          averageRating: parseFloat(parseFloat(stats.average_rating).toFixed(1)),
          totalReviews: parseInt(stats.total_reviews),
          starBreakdown: {
            star5: parseInt(stats.star_5),
            star4: parseInt(stats.star_4),
            star3: parseInt(stats.star_3),
            star2: parseInt(stats.star_2),
            star1: parseInt(stats.star_1)
          }
        }
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
 * POST /api/v1/reviews
 * Gửi đánh giá sản phẩm mới. Ràng buộc kiểm tra người mua thực (Verified Purchase):
 * Khách hàng bắt buộc phải có order_item_id hợp lệ thuộc đơn hàng đã hoàn thành (completed / delivered).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, productId, orderItemId, rating, title, content, images } = body;

    if (!customerId || !productId || !orderItemId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Vui lòng cung cấp đầy đủ thông tin đánh giá và số sao (1-5)' },
        { status: 400 }
      );
    }

    // 1. Kiểm tra xác minh người mua thực (Verified Purchase)
    const verifyQuery = `
      SELECT oi.order_item_id 
      FROM order_items oi
      INNER JOIN orders o ON oi.order_id = o.order_id
      INNER JOIN product_variants v ON oi.variant_id = v.variant_id
      WHERE oi.order_item_id = $1 
        AND o.customer_id = $2 
        AND v.product_id = $3
        AND o.status IN ('completed', 'delivered')
    `;
    const { rows: verifyRows } = await dbQuery(verifyQuery, [orderItemId, customerId, productId]);

    if (verifyRows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Forbidden', 
          message: 'Bạn chỉ có thể gửi đánh giá cho sản phẩm sau khi đã mua và nhận hàng thành công (Verified Purchase)' 
        },
        { status: 403 }
      );
    }

    // 2. Kiểm tra xem mặt hàng trong đơn này đã từng được đánh giá chưa
    const checkDuplicateQuery = `SELECT review_id FROM reviews WHERE order_item_id = $1`;
    const { rows: dupRows } = await dbQuery(checkDuplicateQuery, [orderItemId]);

    if (dupRows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Conflict', message: 'Mặt hàng này trong đơn hàng của bạn đã được đánh giá trước đó' },
        { status: 409 }
      );
    }

    // 3. Chèn bản ghi đánh giá mới với nhãn verified purchase = true
    const insertQuery = `
      INSERT INTO reviews (product_id, customer_id, order_item_id, rating, title, content, images, is_verified_purchase, is_approved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, true)
      RETURNING *
    `;

    const { rows: createdRows } = await dbQuery(insertQuery, [
      productId,
      customerId,
      orderItemId,
      rating,
      title || null,
      content || null,
      images ? JSON.stringify(images) : null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Gửi đánh giá sản phẩm thành công',
      data: createdRows[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
