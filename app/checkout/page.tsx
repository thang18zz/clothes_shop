'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/useCart';
import { SHIPPING_CARRIERS } from '@/lib/mockData';
import { ShippingCarrier, PaymentMethod } from '@/lib/types';
import { ShieldCheck, ArrowLeft, CheckCircle2, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getSubtotal, getDiscountAmount, getTotal, clearCart } = useCart();

  const [selectedCarrier, setSelectedCarrier] = useState<ShippingCarrier>(SHIPPING_CARRIERS[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('vnpay');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    province: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressLine: '',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default check for logged-in status

  const shippingFee = selectedCarrier.fee;
  const finalTotal = getTotal() + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const mockOrderNum = `#CS${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(mockOrderNum);
    setIsSubmitted(true);
    clearCart();
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Đặt Hàng Thành Công!</h1>
          <p className="text-slate-600 text-sm">
            Mã đơn hàng của bạn: <strong className="text-brand-700 font-mono text-base">{orderNumber}</strong>
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Cảm ơn bạn đã mua sắm tại CLOTHES SHOP. Thông tin chi tiết đơn hàng và theo dõi vận chuyển đã được gửi tới email của bạn.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/products"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-500">Hãy thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2.5 bg-brand-600 text-white font-semibold text-xs rounded-xl"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center space-x-2">
        <Link href="/products" className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại sản phẩm</span>
        </Link>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Shipping & Customer Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Info Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thông Tin Giao Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Số Điện Thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email (Nhận xác nhận đơn)</label>
              <input
                type="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Địa Chỉ Chi Tiết (Số nhà, tên đường) *</label>
              <input
                type="text"
                required
                placeholder="Số 123 Đường Nguyễn Huệ"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Shipping Carrier Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-brand-600" />
              <span>Đơn Vị Vận Chuyển</span>
            </h2>

            <div className="space-y-3">
              {SHIPPING_CARRIERS.map((carrier) => (
                <label
                  key={carrier.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedCarrier.id === carrier.id
                      ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="carrier"
                      checked={selectedCarrier.id === carrier.id}
                      onChange={() => setSelectedCarrier(carrier)}
                      className="accent-brand-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{carrier.name}</p>
                      <p className="text-[11px] text-slate-500">Dự kiến giao: {carrier.estimatedDays}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-700">
                    {carrier.fee.toLocaleString('vi-VN')}đ
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-brand-600" />
              <span>Phương Thức Thanh Toán</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'vnpay', name: 'Ví VNPay / QR', desc: 'Thanh toán quét mã VNPAY-QR' },
                { id: 'momo', name: 'Ví MoMo', desc: 'Thanh toán trực tuyến MoMo' },
                { id: 'cod', name: 'COD (Tiền Mặt)', desc: 'Thanh toán khi nhận hàng' },
              ].map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm.id as PaymentMethod)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    selectedPayment === pm.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold ring-1 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{pm.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{pm.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Tóm Tắt Đơn Hàng ({items.length} món)
            </h2>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {items.map((item) => (
                <div key={item.variantId} className="flex space-x-3 items-center">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image src={item.product.images[0]?.url || ''} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-slate-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-slate-400">
                      Size {item.selectedSize} • {item.selectedColor.name} • x{item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{getSubtotal().toLocaleString('vi-VN')}đ</span>
              </div>
              {getDiscountAmount() > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Giảm giá mã coupon</span>
                  <span>-{getDiscountAmount().toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Tổng số tiền</span>
                <span className="text-brand-700">{finalTotal.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition text-sm flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Xác Nhận Đặt Hàng ({finalTotal.toLocaleString('vi-VN')}đ)</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
