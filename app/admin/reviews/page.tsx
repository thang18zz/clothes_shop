'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const [reply, setReply] = useState('');
  const [msg, setMsg] = useState('');

  const handleModerate = async (reviewId: string, approved: boolean) => {
    try {
      const res = await fetch('/api/v1/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: reviewId, is_approved: approved, admin_reply: reply })
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Đã duyệt đánh giá thành công!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>⭐ Kiểm Duyệt Đánh Giá Khách Hàng (Moderation)</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Phê duyệt/ẩn nhận xét của người mua thực và viết trả lời từ phía Shop</p>

      {/* Admin Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/admin" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Overview Analytics
        </Link>
        <Link href="/admin/products" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Quản lý Sản phẩm
        </Link>
        <Link href="/admin/reviews" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Duyệt Đánh Giá
        </Link>
      </div>

      {msg && <div style={{ padding: '12px', background: '#ecfdf5', color: '#047857', borderRadius: '6px', marginBottom: '16px' }}>{msg}</div>}

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', background: '#fff', maxWidth: '700px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold' }}>Nguyễn Văn B (Khách hàng thực)</span>
          <span style={{ color: '#f59e0b' }}>⭐⭐⭐⭐⭐</span>
        </div>
        <p style={{ color: '#4b5563', margin: '0 0 16px 0' }}>&quot;Áo polo mặc rất vừa vặn, chất vải thoáng mát không bị nhăn sau khi giặt. Shop giao hàng siêu nhanh!&quot;</p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Viết phản hồi từ Shop:</label>
          <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Cảm ơn bạn đã ủng hộ Clothes Shop..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleModerate('rev-1', true)} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            ✓ Phê Duyệt & Đăng Nhận Xét
          </button>
          <button onClick={() => handleModerate('rev-1', false)} style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
            ✕ Ẩn Đánh Giá
          </button>
        </div>
      </div>
    </div>
  );
}
