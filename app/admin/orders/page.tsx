'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const handleGenerateInvoice = async () => {
    try {
      const res = await fetch('/api/v1/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_invoice',
          order_id: 'd212b667-e290-41c9-a21e-47da9afebf83'
        })
      });
      const data = await res.json();
      if (data.success) {
        setInvoiceData(data.invoice_data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>📑 Quản Lý Đơn Hàng & In Phiếu Giao Hàng (Staff)</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Phê duyệt đơn hàng loạt, chuyển trạng thái đóng gói và xuất phiếu PDF Invoice</p>

      {/* Admin Sub-menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '30px' }}>
        <Link href="/admin" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Overview Analytics
        </Link>
        <Link href="/admin/products" style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
          Quản lý Sản phẩm
        </Link>
        <Link href="/admin/orders" style={{ padding: '8px 16px', background: '#111827', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
          Duyệt Đơn & In phiếu
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Đơn hàng #CS20260812001 (Chờ đóng gói)</h3>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>Khách hàng: Nguyễn Văn A (0901234567)</p>
          </div>
          <button onClick={handleGenerateInvoice} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            🖨️ Xuất PDF Phiếu Giao Hàng & Hóa Đơn
          </button>
        </div>

        {invoiceData && (
          <div style={{ border: '2px dashed #93c5fd', padding: '20px', background: '#eff6ff', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#1e40af' }}>📄 HÓA ĐƠN VẬN CHUYỂN IN TRỰC TIẾP (DELIVERY SLIP)</h4>
            <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}><strong>Mã vận đơn (GHTK):</strong> GHTK-VN-8849204</p>
            <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}><strong>Người nhận:</strong> Nguyễn Văn A - 123 Nguyễn Trãi, Quận 1, TP.HCM</p>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}><strong>Sản phẩm:</strong> 2x Áo Polo Cotton Premium (Màu Đen, Size L)</p>
            <button onClick={() => window.print()} style={{ padding: '6px 16px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              In ngay qua máy in nhiệt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
