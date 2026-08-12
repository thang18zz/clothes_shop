import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/admin/analytics
 * Báo cáo doanh thu, sản phẩm bán chạy, cảnh báo kho thấp (Dashboard Analytics)
 */
export async function GET() {
  try {
    // 1. Tổng doanh thu & tổng đơn hàng
    const statsQuery = `
      SELECT 
        COUNT(order_id) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders
    `;
    const { rows: stats } = await dbQuery(statsQuery);

    // 2. Top 5 sản phẩm bán chạy nhất
    const topProductsQuery = `
      SELECT p.name, SUM(i.quantity) as total_sold
      FROM order_items i
      JOIN product_variants v ON i.variant_id = v.variant_id
      JOIN products p ON v.product_id = p.product_id
      GROUP BY p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `;
    const { rows: topProducts } = await dbQuery(topProductsQuery);

    // 3. Cảnh báo sản phẩm sắp hết hàng (Low stock alert < 10)
    const lowStockQuery = `
      SELECT p.name, v.size, v.color, inv.quantity_on_hand
      FROM inventory inv
      JOIN product_variants v ON inv.variant_id = v.variant_id
      JOIN products p ON v.product_id = p.product_id
      WHERE inv.quantity_on_hand < 10
      ORDER BY inv.quantity_on_hand ASC
    `;
    const { rows: lowStock } = await dbQuery(lowStockQuery);

    return NextResponse.json({
      success: true,
      message: 'Lấy báo cáo phân tích Admin thành công',
      data: {
        summary: stats[0],
        top_selling_products: topProducts,
        low_stock_alerts: lowStock
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
