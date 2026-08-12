import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/admin/products - Thêm sản phẩm mới kèm biến thể (Admin)
 * PUT /api/v1/admin/products - Cập nhật sản phẩm & giá (Admin)
 * DELETE /api/v1/admin/products - Vô hiệu hóa/Xóa sản phẩm (Admin)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, category_id, brand_id, base_price, is_active } = body;

    if (!name || !slug || !category_id || !base_price) {
      return NextResponse.json(
        { success: false, error: 'Tên, slug, danh mục và giá gốc là bắt buộc' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO products (name, slug, description, category_id, brand_id, base_price, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const { rows } = await dbQuery(insertQuery, [
      name,
      slug,
      description || '',
      category_id,
      brand_id || null,
      base_price,
      is_active !== undefined ? is_active : true
    ]);

    return NextResponse.json({
      success: true,
      message: 'Tạo sản phẩm mới thành công',
      data: rows[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { product_id, name, base_price, description, is_active } = body;

    if (!product_id) {
      return NextResponse.json(
        { success: false, error: 'product_id là bắt buộc' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE products
      SET 
        name = COALESCE($1, name),
        base_price = COALESCE($2, base_price),
        description = COALESCE($3, description),
        is_active = COALESCE($4, is_active),
        updated_at = NOW()
      WHERE product_id = $5
      RETURNING *
    `;

    const { rows } = await dbQuery(updateQuery, [name, base_price, description, is_active, product_id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: rows[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'product_id là bắt buộc' }, { status: 400 });
    }

    const deleteQuery = `
      UPDATE products SET is_active = false, updated_at = NOW() WHERE product_id = $1 RETURNING *
    `;

    const { rows } = await dbQuery(deleteQuery, [productId]);

    return NextResponse.json({
      success: true,
      message: 'Vô hiệu hóa sản phẩm thành công (Soft Delete)',
      data: rows[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
