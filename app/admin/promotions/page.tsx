'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminPromotionsPage() {
  const [code, setCode] = useState('FLASH50');
  const [discountValue, setDiscountValue] = useState('50000');
  const [msg, setMsg] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, discount_type: 'fixed_amount', discount_value: Number(discountValue) })
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Khởi tạo thành công mã khuyến mãi ${code}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>🎟️ Thiết Lập Mã Giảm Giá & Flash Sale (Marketing)</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Tạo coupon chiết khấu, cấu hình Flash Sale đếm ngược và các gói Combo/Bundle mua sắm</p>

      {/* Admin Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/admin" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Overview Analytics
        </Link>
        <Link href="/admin/products" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Quản lý Sản phẩm
        </Link>
        <Link href="/admin/promotions" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Tạo Khuyến Mãi
        </Link>
      </div>

      <div style={{ maxWidth: '600px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', background: '#fff' }}>
        {msg && <div style={{ padding: '12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', marginBottom: '16px' }}>{msg}</div>}
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Mã Khuyến Mãi / Mã Coupon:</label>
            <input value={code} onChange={e => setCode(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Số tiền giảm (VNĐ):</label>
            <input value={discountValue} onChange={e => setDiscountValue(e.target.value)} type="number" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>
          <button type="submit" style={{ padding: '12px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 600 }}>
            Kích hoạt chương trình Khuyến mãi
          </button>
        </form>
      </div>
    </div>
  );
}
