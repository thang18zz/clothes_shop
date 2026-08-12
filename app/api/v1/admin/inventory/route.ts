import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/admin/inventory
 * Xử lý nhập kho vật lý (goods_receipt) hoặc kiểm kê điều chỉnh kho (stocktake)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, variant_id, quantity } = body;

    if (!variant_id || quantity === undefined || !['goods_receipt', 'stocktake'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Chế độ (goods_receipt hoặc stocktake), variant_id và số lượng là bắt buộc' },
        { status: 400 }
      );
    }

    if (action === 'goods_receipt') {
      // Cộng dồn tồn kho vật lý
      const query = `
        INSERT INTO inventory (variant_id, quantity_on_hand, quantity_reserved)
        VALUES ($1, $2, 0)
        ON CONFLICT (variant_id)
        DO UPDATE SET quantity_on_hand = inventory.quantity_on_hand + EXCLUDED.quantity_on_hand, updated_at = NOW()
        RETURNING *
      `;
      const { rows } = await dbQuery(query, [variant_id, quantity]);
      return NextResponse.json({
        success: true,
        message: `Nhập kho thành công +${quantity} sản phẩm`,
        data: rows[0]
      });
    } else {
      // Stocktake - Cài đặt trực tiếp số lượng kho thực tế kiểm kê
      const query = `
        INSERT INTO inventory (variant_id, quantity_on_hand, quantity_reserved)
        VALUES ($1, $2, 0)
        ON CONFLICT (variant_id)
        DO UPDATE SET quantity_on_hand = $2, updated_at = NOW()
        RETURNING *
      `;
      const { rows } = await dbQuery(query, [variant_id, quantity]);
      return NextResponse.json({
        success: true,
        message: `Kiểm kê kho thành công, cập nhật tồn kho = ${quantity}`,
        data: rows[0]
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
