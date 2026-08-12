import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/loyalty/redeem
 * Đổi điểm thưởng tích lũy (Loyalty Points) lấy Voucher / Mã giảm giá.
 * Tỷ lệ đổi: 1 điểm = 100 VNĐ.
 */
export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { customerId, pointsToRedeem } = body;

    if (!customerId || !pointsToRedeem || pointsToRedeem <= 0) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Vui lòng cung cấp customerId và số điểm cần đổi > 0' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // 1. Khóa bản ghi khách hàng để kiểm tra số điểm tích lũy hiện có
    const customerQuery = `
      SELECT customer_id, loyalty_points, full_name 
      FROM customers 
      WHERE customer_id = $1 FOR UPDATE
    `;
    const { rows: customerRows } = await client.query(customerQuery, [customerId]);

    if (customerRows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: 'Not Found', message: 'Không tìm thấy thông tin khách hàng' },
        { status: 404 }
      );
    }

    const customer = customerRows[0];
    const currentPoints = parseInt(customer.loyalty_points || 0);

    if (currentPoints < pointsToRedeem) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bad Request', 
          message: `Số điểm tích lũy hiện tại (${currentPoints} điểm) không đủ để đổi ${pointsToRedeem} điểm` 
        },
        { status: 400 }
      );
    }

    // 2. Trừ số điểm tích lũy của khách hàng
    const updatedPoints = currentPoints - pointsToRedeem;
    await client.query(
      `UPDATE customers SET loyalty_points = $1, updated_at = CURRENT_TIMESTAMP WHERE customer_id = $2`,
      [updatedPoints, customerId]
    );

    // 3. Quy đổi ra giá trị mã giảm giá (1 điểm = 100đ)
    const discountAmount = pointsToRedeem * 100;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const voucherCode = `LOYALTY${pointsToRedeem}P_${randomSuffix}`;

    // 4. Sinh bản ghi Voucher độc quyền trong bảng Promotions
    const createVoucherQuery = `
      INSERT INTO promotions (code, description, discount_type, discount_value, min_order_value, usage_limit, times_used, is_active)
      VALUES ($1, $2, 'fixed_amount', $3, 0, 1, 0, true)
      RETURNING *
    `;

    const { rows: voucherRows } = await client.query(createVoucherQuery, [
      voucherCode,
      `Voucher ${discountAmount.toLocaleString('vi-VN')}đ đổi từ ${pointsToRedeem} điểm Loyalty`,
      discountAmount
    ]);

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: `Đổi ${pointsToRedeem} điểm thành công! Nhận mã giảm giá trị giá ${discountAmount.toLocaleString('vi-VN')}đ`,
      data: {
        voucherCode,
        discountAmount,
        remainingPoints: updatedPoints,
        promotion: voucherRows[0]
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
