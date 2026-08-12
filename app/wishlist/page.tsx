'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/v1/wishlist');
      const data = await res.json();
      if (data.success) {
        setWishlist(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch('/api/v1/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId })
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(prev => prev.filter(item => item.product_id !== productId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>❤️ Danh Sách Yêu Thích (Wishlist)</h1>
          <p style={{ color: '#666', marginTop: '6px' }}>Các sản phẩm thời trang bạn đã thả tim lưu lại mua sau</p>
        </div>
        <Link href="/products" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
          ← Tiếp tục khám phá sản phẩm
        </Link>
      </div>

      {loading ? (
        <p>Đang tải danh sách yêu thích...</p>
      ) : wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '12px' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>Chưa có sản phẩm nào trong danh sách yêu thích của bạn.</p>
          <Link href="/products" style={{ padding: '12px 24px', background: '#111827', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            Khám phá cửa hàng ngay
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {wishlist.map(item => (
            <div key={item.product_id || item.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: '#fff', padding: '16px' }}>
              <div style={{ width: '100%', height: '220px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                👕
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>{item.name || 'Áo Polo Premium'}</h3>
              <p style={{ color: '#059669', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                {Number(item.base_price || 350000).toLocaleString('vi-VN')} đ
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href={`/products/${item.slug || 'polo-premium'}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                  Xem chi tiết
                </Link>
                <button onClick={() => removeItem(item.product_id)} style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
