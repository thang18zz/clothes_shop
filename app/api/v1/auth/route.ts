import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'clothes_shop_jwt_secret_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'clothes_shop_jwt_refresh_secret_2026';

/**
 * Hàm sinh Access Token (15 phút) và Refresh Token (30 ngày)
 */
function generateTokens(payload: { userId: string; email: string; role: string }) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
}

/**
 * POST /api/v1/auth
 * Quản lý Đăng ký (Register), Đăng nhập (Login), Làm mới Token (Refresh), và Đăng xuất (Logout)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, fullName, phone, refreshToken } = body;

    // 1. ĐĂNG KÝ (REGISTER)
    if (action === 'register') {
      if (!email || !password || !fullName) {
        return NextResponse.json(
          { success: false, error: 'Bad Request', message: 'Vui lòng cung cấp email, mật khẩu và họ tên' },
          { status: 400 }
        );
      }

      // Kiểm tra trùng lặp email
      const checkEmail = await dbQuery(`SELECT customer_id FROM customers WHERE email = $1`, [email.toLowerCase()]);
      if (checkEmail.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Conflict', message: 'Email này đã được đăng ký tài khoản trước đó' },
          { status: 409 }
        );
      }

      // Hash mật khẩu bằng bcrypt (salt rounds = 10)
      const passwordHash = await bcrypt.hash(password, 10);

      // Tạo khách hàng mới trong DB
      const insertCustomer = `
        INSERT INTO customers (email, password_hash, full_name, phone, tier)
        VALUES ($1, $2, $3, $4, 'regular')
        RETURNING customer_id, email, full_name, tier
      `;
      const { rows } = await dbQuery(insertCustomer, [email.toLowerCase(), passwordHash, fullName, phone || null]);
      const customer = rows[0];

      // Sinh bộ Token JWT
      const tokens = generateTokens({ userId: customer.customer_id, email: customer.email, role: 'customer' });

      const response = NextResponse.json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        user: {
          id: customer.customer_id,
          email: customer.email,
          fullName: customer.full_name,
          tier: customer.tier,
          role: 'customer'
        },
        accessToken: tokens.accessToken
      });

      // Cài đặt Cookie `HttpOnly` cho Refresh Token để chống tấn công XSS
      response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 ngày
      });

      return response;
    }

    // 2. ĐĂNG NHẬP (LOGIN)
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Bad Request', message: 'Vui lòng nhập email và mật khẩu' },
          { status: 400 }
        );
      }

      const findCustomer = `
        SELECT customer_id, email, password_hash, full_name, tier, is_active 
        FROM customers WHERE email = $1
      `;
      const { rows } = await dbQuery(findCustomer, [email.toLowerCase()]);

      if (rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized', message: 'Email hoặc mật khẩu không chính xác' },
          { status: 401 }
        );
      }

      const customer = rows[0];

      if (!customer.is_active) {
        return NextResponse.json(
          { success: false, error: 'Forbidden', message: 'Tài khoản của bạn tạm thời đã bị khóa' },
          { status: 403 }
        );
      }

      // Đối soát hash mật khẩu
      const isMatch = await bcrypt.compare(password, customer.password_hash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized', message: 'Email hoặc mật khẩu không chính xác' },
          { status: 401 }
        );
      }

      const tokens = generateTokens({ userId: customer.customer_id, email: customer.email, role: 'customer' });

      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: {
          id: customer.customer_id,
          email: customer.email,
          fullName: customer.full_name,
          tier: customer.tier,
          role: 'customer'
        },
        accessToken: tokens.accessToken
      });

      response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60
      });

      return response;
    }

    // 3. LÀM MỚI TOKEN (REFRESH TOKEN ROTATION)
    if (action === 'refresh') {
      if (!refreshToken) {
        return NextResponse.json(
          { success: false, error: 'Bad Request', message: 'Thiếu Refresh Token' },
          { status: 400 }
        );
      }

      try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
        const newTokens = generateTokens({ userId: decoded.userId, email: decoded.email, role: decoded.role });

        const response = NextResponse.json({
          success: true,
          accessToken: newTokens.accessToken
        });

        // Xoay vòng cấp mới Refresh Token
        response.cookies.set('refreshToken', newTokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60
        });

        return response;
      } catch (err) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized', message: 'Refresh Token hết hạn hoặc không hợp lệ' },
          { status: 401 }
        );
      }
    }

    // 4. ĐĂNG XUẤT (LOGOUT)
    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Đăng xuất thành công' });
      response.cookies.delete('refreshToken');
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Bad Request', message: 'Hành động (action) không được hỗ trợ' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
