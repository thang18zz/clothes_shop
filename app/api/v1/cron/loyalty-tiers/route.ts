import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/cron/loyalty-tiers
 * Cron Job chạy định kỳ hàng ngày: Tự động tính toán tổng chi tiêu 12 tháng gần nhất của từng khách hàng
 * để nâng phân hạng thành viên (Silver >= 5tr, Gold >= 15tr, Diamond >= 30tr).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET || 'clothes_shop_cron_secret_2026';

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', message: 'Mã bí mật Cron Job không hợp lệ' },
      { status: 401 }
    );
  }

  try {
    // 1. Lấy danh sách tổng chi tiêu của từng khách hàng trong 12 tháng gần nhất từ các đơn hàng hoàn thành
    const calculateSpendingQuery = `
      SELECT 
        c.customer_id,
        c.tier as current_tier,
        COALESCE(SUM(o.total), 0) as total_spent_12m
      FROM customers c
      LEFT JOIN orders o ON c.customer_id = o.customer_id 
        AND o.status IN ('completed', 'delivered')
        AND o.created_at >= CURRENT_TIMESTAMP - INTERVAL '12 months'
      WHERE c.is_active = true
      GROUP BY c.customer_id, c.tier
    `;

    const { rows: customerSpending } = await dbQuery(calculateSpendingQuery);

    let updatedCount = 0;

    // 2. Phân hạng và cập nhật hạng mới cho khách hàng nếu có thay đổi
    for (const item of customerSpending) {
      const spent = parseFloat(item.total_spent_12m);
      let newTier = 'regular';

      if (spent >= 30000000) {
        newTier = 'diamond';
      } else if (spent >= 15000000) {
        newTier = 'gold';
      } else if (spent >= 5000000) {
        newTier = 'silver';
      }

      if (newTier !== item.current_tier) {
        await dbQuery(
          `UPDATE customers SET tier = $1, updated_at = CURRENT_TIMESTAMP WHERE customer_id = $2`,
          [newTier, item.customer_id]
        );
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã đối soát và cập nhật phân hạng Loyalty cho ${updatedCount} khách hàng`,
      data: {
        totalEvaluated: customerSpending.length,
        updatedCount
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
