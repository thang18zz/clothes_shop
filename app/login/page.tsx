'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = '/api/v1/auth';
      const action = isRegister ? 'register' : 'login';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          email,
          password,
          full_name: fullName
        })
      });

      const data = await res.json();
      if (data.success) {
        document.cookie = `auth_token=${data.access_token || 'authenticated'}; path=/; max-age=86400`;
        router.push(redirect);
      } else {
        setError(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.');
      }
    } catch (err: any) {
      setError('Đã có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '32px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          {isRegister ? '📝 Đăng Ký Tài Khoản Khách Hàng' : '🔐 Đăng Nhập Cửa Hàng'}
        </h1>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Trang web bán quần áo chuyên nghiệp bắt buộc đăng nhập để mua sắm & tích điểm VIP
        </p>
      </div>

      {redirect === '/checkout' && (
        <div style={{ padding: '12px', background: '#fef3c7', color: '#92400e', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', lineHeight: 1.4 }}>
          ⚠️ <strong>Chú ý:</strong> Để tiếp tục thanh toán đơn hàng, bạn vui lòng đăng nhập hoặc tạo tài khoản mới ngay bên dưới!
        </div>
      )}

      {error && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Họ và Tên:</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Nguyễn Văn A" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="customer@example.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Mật khẩu:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#111827', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '16px' }}>
          {loading ? 'Đang xử lý...' : isRegister ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập Ngay'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>
          {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Đang tải form đăng nhập...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
