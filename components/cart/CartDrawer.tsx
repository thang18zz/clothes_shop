'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/useCart';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponMessage({ success: res.success, text: res.message });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-slate-900">Giỏ Hàng Của Bạn</h2>
              <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-800 font-medium text-base">Giỏ hàng đang trống</p>
                  <p className="text-slate-500 text-sm mt-1">Hãy khám phá thêm sản phẩm thời trang chất lượng ngay nhé.</p>
                </div>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg text-sm transition shadow-sm"
                >
                  Tiếp Tục Mua Sắm
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex space-x-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition bg-slate-50/50"
                >
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={item.product.images[0]?.url || ''}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span>Size: <strong className="text-slate-700">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <span>Màu:</span>
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 border border-slate-200 rounded-lg bg-white p-1">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 transition rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2 text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 transition rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-brand-700">
                        {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-2 rounded-lg">
                    <span className="font-medium flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Mã: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.value}%)</span>
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-green-700 hover:text-green-900 font-bold underline text-xs"
                    >
                      Bỏ mã
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá (VD: WELCOME10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition"
                    >
                      Áp dụng
                    </button>
                  </form>
                )}
                {couponMessage && !appliedCoupon && (
                  <p className={`text-xs mt-1 ${couponMessage.success ? 'text-green-600' : 'text-red-500'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Tạm tính</span>
                  <span>{getSubtotal().toLocaleString('vi-VN')}đ</span>
                </div>
                {getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-xs text-green-600 font-medium">
                    <span>Giảm giá</span>
                    <span>-{getDiscountAmount().toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Tổng tiền</span>
                  <span className="text-brand-700">{getTotal().toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setCartDrawerOpen(false)}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition shadow-md shadow-brand-600/20"
              >
                <span>Tiến Hành Thanh Toán</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
