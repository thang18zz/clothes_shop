import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/addresses
 * Lấy danh sách sổ địa chỉ giao hàng của khách hàng.
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

    const addressesQuery = `
      SELECT address_id, recipient_name, phone, province, district, ward, street_address, is_default, created_at
      FROM customer_addresses
      WHERE customer_id = $1
      ORDER BY is_default DESC, created_at DESC
    `;

    const { rows: addresses } = await dbQuery(addressesQuery, [customerId]);

    return NextResponse.json({ success: true, data: addresses });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/addresses
 * Thêm địa chỉ giao hàng mới vào sổ địa chỉ.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, recipientName, phone, province, district, ward, streetAddress, isDefault } = body;

    if (!customerId || !recipientName || !phone || !province || !district || !ward || !streetAddress) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Vui lòng cung cấp đầy đủ thông tin địa chỉ giao hàng' },
        { status: 400 }
      );
    }

    // Nếu địa chỉ mới được đặt làm mặc định -> Hủy địa chỉ mặc định cũ
    if (isDefault) {
      await dbQuery(
        `UPDATE customer_addresses SET is_default = false WHERE customer_id = $1`,
        [customerId]
      );
    }

    const insertQuery = `
      INSERT INTO customer_addresses (customer_id, recipient_name, phone, province, district, ward, street_address, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const { rows } = await dbQuery(insertQuery, [
      customerId,
      recipientName,
      phone,
      province,
      district,
      ward,
      streetAddress,
      isDefault || false
    ]);

    return NextResponse.json({
      success: true,
      message: 'Thêm địa chỉ giao hàng thành công',
      data: rows[0]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/addresses
 * Xóa một địa chỉ khỏi sổ địa chỉ.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('addressId');

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request', message: 'Thiếu tham số addressId' },
        { status: 400 }
      );
    }

    const deleteQuery = `DELETE FROM customer_addresses WHERE address_id = $1 RETURNING *`;
    const { rowCount } = await dbQuery(deleteQuery, [addressId]);

    if (rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Not Found', message: 'Không tìm thấy địa chỉ giao hàng tương ứng' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Xóa địa chỉ giao hàng thành công' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
