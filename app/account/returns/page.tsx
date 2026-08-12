'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CustomerReturnsPage() {
  const [reason, setReason] = useState('wrong_size');
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: 'd212b667-e290-41c9-a21e-47da9afebf83',
          order_item_id: 'item-1',
          reason,
          notes: description
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Gửi yêu cầu đổi trả thành công! Số tiền hoàn dự kiến (Pro-rated): ${data.refund_amount || '150,000'}đ`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>🔄 Biểu Mẫu Yêu Cầu Đổi Trả (RMA Request)</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Hỗ trợ đổi size/màu hoặc hoàn tiền theo chính sách bảo hành 30 ngày</p>

      {/* Navigation Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/account" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Tổng quan
        </Link>
        <Link href="/account/orders" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Đơn hàng của tôi
        </Link>
        <Link href="/account/returns" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Gửi Yêu cầu Đổi trả
        </Link>
      </div>

      <div style={{ maxWidth: '600px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', background: '#fff' }}>
        {statusMsg ? (
          <div style={{ padding: '16px', background: '#ecfdf5', color: '#047857', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>
            {statusMsg}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Lý do đổi trả:</label>
            <select value={reason} onChange={e => setReason(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
              <option value="wrong_size">Mặc không vừa size (Đổi size mới)</option>
              <option value="defective">Sản phẩm bị lỗi chỉ/vải từ nhà sản xuất</option>
              <option value="not_as_described">Hàng nhận được không giống mô tả</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Mô tả chi tiết & Hình ảnh bằng chứng:</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Nhập tình trạng sản phẩm..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>

          <button type="submit" style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, width: '100%' }}>
            Gửi yêu cầu đổi trả ngay
          </button>
        </form>
      </div>
    </div>
  );
}
