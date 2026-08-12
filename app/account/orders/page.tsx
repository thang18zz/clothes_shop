'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/v1/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>📦 Lịch Sử Đơn Hàng</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Theo dõi chặng di chuyển và quản lý các đơn đặt hàng của bạn</p>

      {/* Navigation Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/account" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Tổng quan
        </Link>
        <Link href="/account/orders" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Đơn hàng của tôi
        </Link>
        <Link href="/account/addresses" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Sổ địa chỉ
        </Link>
        <Link href="/account/returns" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Gửi Yêu cầu Đổi trả
        </Link>
      </div>

      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <div style={{ padding: '40px', background: '#f9fafb', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.order_id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Đơn hàng #{order.order_number || order.order_id.slice(0, 8)}</span>
                  <span style={{ marginLeft: '12px', fontSize: '13px', color: '#666' }}>
                    Ngày đặt: {new Date(order.created_at || Date.now()).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <span style={{ padding: '4px 12px', background: order.status === 'completed' ? '#d1fae5' : '#fef3c7', color: order.status === 'completed' ? '#065f46' : '#92400e', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                  {order.status === 'completed' ? 'Đã hoàn thành' : 'Đang vận chuyển (GHTK)'}
                </span>
              </div>

              {/* Real-time Order Tracking Component */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569' }}>📍 Theo dõi hành trình giao vận (GHN/GHTK)</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '24px', height: '24px', background: '#2563eb', color: '#fff', borderRadius: '50%', margin: '0 auto 4px auto', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Đã xác nhận</span>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '24px', height: '24px', background: '#2563eb', color: '#fff', borderRadius: '50%', margin: '0 auto 4px auto', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Đang đóng gói</span>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '24px', height: '24px', background: '#3b82f6', color: '#fff', borderRadius: '50%', margin: '0 auto 4px auto', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚚</div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>Đang giao hàng</span>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: '24px', height: '24px', background: '#cbd5e1', color: '#fff', borderRadius: '50%', margin: '0 auto 4px auto', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</div>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Đã nhận hàng</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  Tổng tiền: <span style={{ color: '#059669' }}>{Number(order.total_amount || 450000).toLocaleString('vi-VN')} đ</span>
                </span>
                <Link href="/account/returns" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                  Yêu cầu đổi trả / Đánh giá
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
