'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Heart, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/useCart';

export default function Header() {
  const { getItemCount, setCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center space-x-2">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
        <span>Miễn phí vận chuyển cho đơn hàng từ 500.000đ • Đổi trả dễ dàng trong 15 ngày</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-wider text-slate-900 uppercase">
                CLOTHES<span className="text-brand-600">SHOP</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-700">
              <Link href="/products" className="hover:text-brand-600 transition">
                Tất Cả Sản Phẩm
              </Link>
              <Link href="/products?category=ao-thun" className="hover:text-brand-600 transition">
                Áo Thun
              </Link>
              <Link href="/products?category=ao-so-mi" className="hover:text-brand-600 transition">
                Áo Sơ Mi
              </Link>
              <Link href="/products?category=quan-jeans" className="hover:text-brand-600 transition">
                Quần Jeans
              </Link>
              <Link href="/products?category=ao-khoac" className="hover:text-brand-600 transition">
                Áo Khoác
              </Link>
            </nav>
          </div>

          {/* Right Actions: Search, Wishlist, Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block w-48">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-transparent rounded-full focus:bg-white focus:border-brand-500 focus:outline-none transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <Link href="/wishlist" className="p-2 text-slate-600 hover:text-brand-600 transition relative">
              <Heart className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="p-2 text-slate-700 hover:text-brand-600 transition relative flex items-center"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-brand-600 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Tất Cả Sản Phẩm
          </Link>
          <Link
            href="/products?category=ao-thun"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Áo Thun
          </Link>
          <Link
            href="/products?category=ao-so-mi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Áo Sơ Mi
          </Link>
          <Link
            href="/products?category=quan-jeans"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Quần Jeans
          </Link>
        </div>
      )}
    </header>
  );
}
