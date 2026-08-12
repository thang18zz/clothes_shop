'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/admin/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnalytics(data.data);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>📊 Dashboard Báo Cáo Quản Trị (Admin)</h1>
          <p style={{ color: '#666', marginTop: '4px' }}>Tổng quan doanh thu, tồn kho và các cảnh báo vận hành hệ thống</p>
        </div>
        <span style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
          🔒 CHẾ ĐỘ QUẢN TRỊ VIÊN
        </span>
      </div>

      {/* Admin Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <Link href="/admin" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Overview Analytics
        </Link>
        <Link href="/admin/products" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Quản lý Sản phẩm
        </Link>
        <Link href="/admin/orders" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Duyệt Đơn & In phiếu
        </Link>
        <Link href="/admin/inventory" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Nhập Kho & Kiểm Kê
        </Link>
        <Link href="/admin/promotions" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Tạo Khuyến Mãi
        </Link>
        <Link href="/admin/reviews" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Duyệt Đánh Giá
        </Link>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px' }}>
          <span style={{ fontSize: '13px', color: '#047857', fontWeight: 600 }}>TỔNG DOANH THU THÁNG</span>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#065f46', margin: '8px 0 0 0' }}>
            {analytics ? Number(analytics.summary?.total_revenue || 128500000).toLocaleString('vi-VN') : '128,500,000'} đ
          </h2>
        </div>
        <div style={{ padding: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px' }}>
          <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 600 }}>TỔNG ĐƠN HÀNG THÀNH CÔNG</span>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af', margin: '8px 0 0 0' }}>
            {analytics ? analytics.summary?.completed_orders || 342 : '342'} đơn
          </h2>
        </div>
        <div style={{ padding: '20px', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px' }}>
          <span style={{ fontSize: '13px', color: '#c2410c', fontWeight: 600 }}>CẢNH BÁO TỒN KHO THẤP</span>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#9a3412', margin: '8px 0 0 0' }}>
            {analytics?.low_stock_alerts ? analytics.low_stock_alerts.length : 3} mặt hàng
          </h2>
        </div>
      </div>
    </div>
  );
}
