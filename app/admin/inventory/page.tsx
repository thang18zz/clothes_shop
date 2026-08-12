'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminInventoryPage() {
  const [action, setAction] = useState('goods_receipt');
  const [variantId, setVariantId] = useState('v-101');
  const [quantity, setQuantity] = useState('50');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, variant_id: variantId, quantity: Number(quantity) })
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>🏭 Quản Lý Nhập Kho & Kiểm Kê Định Kỳ (Warehouse)</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Lập phiếu nhập kho từ nhà cung cấp và thực hiện kiểm kê tồn kho thực tế</p>

      {/* Admin Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/admin" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Overview Analytics
        </Link>
        <Link href="/admin/products" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Quản lý Sản phẩm
        </Link>
        <Link href="/admin/inventory" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Nhập Kho & Kiểm Kê
        </Link>
      </div>

      <div style={{ maxWidth: '600px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', background: '#fff' }}>
        {msg && <div style={{ padding: '12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', marginBottom: '16px' }}>{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Loại thao tác kho:</label>
            <select value={action} onChange={e => setAction(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
              <option value="goods_receipt">📥 Phiếu Nhập Kho từ Nhà Cung Cấp (+ Tồn Kho)</option>
              <option value="stocktake">📋 Kiểm Kê Định Kỳ (Điều chỉnh Tồn Kho)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Mã biến thể sản phẩm (Variant SKU):</label>
            <input value={variantId} onChange={e => setVariantId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Số lượng tồn kho:</label>
            <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>

          <button type="submit" style={{ padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 600 }}>
            Lưu phiếu kho
          </button>
        </form>
      </div>
    </div>
  );
}
