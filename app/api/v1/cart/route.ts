import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/cart
 * Lấy danh sách các mặt hàng trong giỏ hàng của người dùng (theo customer_id hoặc guest session_id).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const sessionId = searchParams.get('sessionId');

    if (!customerId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Yêu cầu customerId hoặc sessionId' },
        { status: 400 }
      );
    }

    const queryText = `
      SELECT 
        c.cart_item_id,
        c.quantity,
        v.variant_id,
        v.size,
        v.sku,
        v.price_adjustment,
        col.name as color_name,
        col.hex_code,
        p.product_id,
        p.name as product_name,
        p.slug as product_slug,
        p.base_price,
        p.sale_price,
        inv.quantity_on_hand - inv.quantity_reserved as quantity_available,
        (
          SELECT url FROM product_images 
          WHERE product_id = p.product_id AND (color_id = v.color_id OR color_id IS NULL)
          ORDER BY is_primary DESC, sort_order ASC LIMIT 1
        ) as image_url
      FROM cart_items c
      INNER JOIN product_variants v ON c.variant_id = v.variant_id
      INNER JOIN colors col ON v.color_id = col.color_id
      INNER JOIN products p ON v.product_id = p.product_id
      INNER JOIN inventory inv ON v.variant_id = inv.variant_id
      WHERE ${customerId ? 'c.customer_id = $1' : 'c.session_id = $1'}
    `;

    const { rows: cartItems } = await dbQuery(queryText, [customerId || sessionId]);

    return NextResponse.json({ success: true, data: cartItems });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/cart
 * Thêm hoặc cập nhật số lượng của một biến thể sản phẩm trong giỏ hàng.
 * Kiểm tra tồn kho trước khi thực hiện để đảm bảo số lượng khả dụng.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, sessionId, variantId, quantity } = body;

    if (!variantId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Thiếu thông số variantId hoặc quantity' },
        { status: 400 }
      );
    }

    if (!customerId && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Yêu cầu customerId hoặc sessionId' },
        { status: 400 }
      );
    }

    // 1. Kiểm tra số lượng tồn kho khả dụng thực tế
    const inventoryQuery = `
      SELECT quantity_on_hand - quantity_reserved as quantity_available 
      FROM inventory 
      WHERE variant_id = $1
    `;
    const { rows: invRows } = await dbQuery(inventoryQuery, [variantId]);
    const quantityAvailable = parseInt(invRows[0]?.quantity_available || '0');

    if (quantityAvailable < quantity) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Out of Stock', 
          message: `Rất tiếc, số lượng sản phẩm khả dụng trong kho chỉ còn tối đa ${quantityAvailable}` 
        },
        { status: 400 }
      );
    }

    // 2. Chèn mới hoặc cập nhật giỏ hàng (UPSERT)
    const upsertQuery = customerId
      ? `
        INSERT INTO cart_items (customer_id, variant_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (customer_id, variant_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `
      : `
        INSERT INTO cart_items (session_id, variant_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (session_id, variant_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

    const { rows } = await dbQuery(upsertQuery, [customerId || sessionId, variantId, quantity]);

    // 3. Nếu số lượng sau khi cộng gộp vượt quá tồn kho khả dụng, điều chỉnh về mức tối đa
    if (rows[0].quantity > quantityAvailable) {
      const adjustQuery = `
        UPDATE cart_items 
        SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE cart_item_id = $2
        RETURNING *
      `;
      await dbQuery(adjustQuery, [quantityAvailable, rows[0].cart_item_id]);
    }

    return NextResponse.json({ success: true, message: 'Cập nhật giỏ hàng thành công' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/cart
 * Xóa một mặt hàng khỏi giỏ hàng.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('cartItemId');

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Thiếu tham số cartItemId' },
        { status: 400 }
      );
    }

    const deleteQuery = `DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *`;
    const { rowCount } = await dbQuery(deleteQuery, [cartItemId]);

    if (rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Not Found', message: 'Không tìm thấy mục giỏ hàng tương ứng' },
        { status: 444 }
      );
    }

    return NextResponse.json({ success: true, message: 'Xóa mục giỏ hàng thành công' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
