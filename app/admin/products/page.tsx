'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState('350000');
  const [statusMsg, setStatusMsg] = useState('');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          category_id: 1,
          base_price: Number(basePrice)
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Thêm mới sản phẩm "${name}" thành công!`);
        setName('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>🏷️ Quản Lý Bảo Trì Sản Phẩm (Admin CRUD)</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Thêm mới, điều chỉnh giá, chỉnh sửa biến thể size/màu và vô hiệu hóa sản phẩm</p>

      {/* Admin Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/admin" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Overview Analytics
        </Link>
        <Link href="/admin/products" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Quản lý Sản phẩm
        </Link>
        <Link href="/admin/orders" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Duyệt Đơn & In phiếu
        </Link>
      </div>

      <div style={{ maxWidth: '600px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', background: '#fff' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0' }}>➕ Thêm Sản Phẩm Mới</h3>
        {statusMsg && <div style={{ padding: '12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', marginBottom: '16px' }}>{statusMsg}</div>}
        <form onSubmit={handleAddProduct}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Tên sản phẩm quần áo:</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Ví dụ: Áo Sơ Mi Oxford Cotton" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Giá gốc (VNĐ):</label>
            <input value={basePrice} onChange={e => setBasePrice(e.target.value)} required type="number" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>
          <button type="submit" style={{ padding: '12px', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 600 }}>
            Lưu sản phẩm mới
          </button>
        </form>
      </div>
    </div>
  );
}
