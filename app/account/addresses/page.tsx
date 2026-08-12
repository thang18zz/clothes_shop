'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/v1/addresses');
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>📍 Sổ Địa Chỉ Giao Hàng</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Quản lý địa chỉ nhận hàng để thanh toán nhanh chóng hơn</p>

      {/* Navigation Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/account" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Tổng quan
        </Link>
        <Link href="/account/orders" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Đơn hàng của tôi
        </Link>
        <Link href="/account/addresses" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Sổ địa chỉ
        </Link>
        <Link href="/account/returns" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Gửi Yêu cầu Đổi trả
        </Link>
      </div>

      {loading ? (
        <p>Đang tải địa chỉ...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {addresses.map((addr, idx) => (
            <div key={addr.address_id || idx} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', background: '#fff', position: 'relative' }}>
              {addr.is_default && (
                <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                  Mặc định
                </span>
              )}
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>{addr.receiver_name || 'Nguyễn Văn A'}</h3>
              <p style={{ margin: '0 0 4px 0', color: '#4b5563', fontSize: '14px' }}>📞 {addr.phone_number || '0901234567'}</p>
              <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
                🏠 {addr.street_address || '123 Nguyễn Trãi'}, {addr.city || 'TP. Hồ Chí Minh'}
              </p>
              <button style={{ padding: '6px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                Chỉnh sửa
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
