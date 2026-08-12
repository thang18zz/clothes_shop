'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AccountPage() {
  const [loyaltyPoints, setLoyaltyPoints] = useState(150);
  const [redeemSuccess, setRedeemSuccess] = useState('');

  const handleRedeem = async () => {
    try {
      const res = await fetch('/api/v1/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points_to_redeem: 50 })
      });
      const data = await res.json();
      if (data.success) {
        setLoyaltyPoints(prev => prev - 50);
        setRedeemSuccess(`Đổi thành công mã Coupon giảm ${data.discount_amount || '50,000'}đ!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>👤 Tài Khoản Khách Hàng</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Quản lý thông tin cá nhân, điểm thưởng và lịch sử mua sắm của bạn</p>

      {/* Navigation Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/account" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Tổng quan
        </Link>
        <Link href="/account/orders" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Đơn hàng của tôi
        </Link>
        <Link href="/account/addresses" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Sổ địa chỉ
        </Link>
        <Link href="/account/returns" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Gửi Yêu cầu Đổi trả
        </Link>
        <Link href="/wishlist" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Danh sách yêu thích
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Loyalty Tier Box */}
        <div style={{ padding: '24px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#fff', borderRadius: '16px' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Hạng thành viên VIP</span>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 16px 0' }}>🥇 THÀNH VIÊN VÀNG (GOLD TIER)</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Tích lũy chi tiêu: 18,500,000 đ</p>
          <div style={{ background: 'rgba(255,255,255,0.2)', height: '8px', borderRadius: '4px', margin: '12px 0 6px 0', overflow: 'hidden' }}>
            <div style={{ background: '#f59e0b', width: '60%', height: '100%' }} />
          </div>
          <span style={{ fontSize: '12px', opacity: 0.8 }}>Còn 11.5M đ để lên hạng Kim Cương (Diamond)</span>
        </div>

        {/* Loyalty Points Redeem Box */}
        <div style={{ padding: '24px', border: '1px solid #e5e7eb', borderRadius: '16px', background: '#fff' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>⭐ Điểm Thưởng Tích Lũy</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706', marginBottom: '12px' }}>
            {loyaltyPoints} điểm
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Tỷ lệ quy đổi: 1 điểm = 100đ giảm giá trực tiếp vào hóa đơn</p>
          {redeemSuccess && <p style={{ color: '#059669', fontSize: '14px', marginBottom: '12px' }}>{redeemSuccess}</p>}
          <button onClick={handleRedeem} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Đổi 50 điểm lấy Coupon 50k
          </button>
        </div>
      </div>
    </div>
  );
}
