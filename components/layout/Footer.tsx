import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800">
      {/* Guarantees bar */}
      <div className="border-b border-slate-800 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Truck className="w-6 h-6 text-brand-400" />
            <h4 className="font-semibold text-slate-100 text-sm">Giao Hàng Toàn Quốc</h4>
            <p className="text-slate-400">Đồng giá 30k, miễn phí cho đơn từ 500.000đ</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <RotateCcw className="w-6 h-6 text-brand-400" />
            <h4 className="font-semibold text-slate-100 text-sm">Đổi Trả Dễ Dàng</h4>
            <p className="text-slate-400">Đổi size/màu miễn phí tận nhà trong 15 ngày</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-brand-400" />
            <h4 className="font-semibold text-slate-100 text-sm">Chính Hãng 100%</h4>
            <p className="text-slate-400">Cam kết chất liệu cao cấp, đền 200% nếu phát hiện giả</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h3 className="text-lg font-black text-white uppercase tracking-wider">
            CLOTHES<span className="text-brand-500">SHOP</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Thương hiệu thời trang nam/nữ hiện đại. Định hình phong cách tinh tế, tối giản và bền vững.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-brand-400" />
              <span>Hotline: 1900 xxxx (8:00 - 21:00)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-brand-400" />
              <span>Email: support@clothesshop.vn</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Quận 1, Thành phố Hồ Chí Minh</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-slate-100 font-bold text-sm uppercase mb-3">Danh Mục Sản Phẩm</h4>
          <ul className="space-y-2">
            <li><Link href="/products?category=ao-thun" className="hover:text-white transition">Áo Thun Cotton</Link></li>
            <li><Link href="/products?category=ao-so-mi" className="hover:text-white transition">Áo Sơ Mi Linen</Link></li>
            <li><Link href="/products?category=quan-jeans" className="hover:text-white transition">Quần Jeans Vintage</Link></li>
            <li><Link href="/products?category=ao-khoac" className="hover:text-white transition">Áo Khoác Blazer</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-100 font-bold text-sm uppercase mb-3">Hỗ Trợ Khách Hàng</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-white transition">Bảng Quy Đổi Size</Link></li>
            <li><Link href="#" className="hover:text-white transition">Chính Sách Đổi Trả & Hoàn Tiền</Link></li>
            <li><Link href="#" className="hover:text-white transition">Hướng Dẫn Bảo Quản Sợi Vải</Link></li>
            <li><Link href="#" className="hover:text-white transition">Chính Sách Bảo Mật</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-100 font-bold text-sm uppercase mb-3">Đăng Ký Nhận Voucher 10%</h4>
          <p className="text-slate-400 mb-3 leading-relaxed">
            Nhận mã giảm giá độc quyền cho đơn hàng đầu tiên và cập nhật bộ sưu tập mới nhất.
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-xs flex-1 focus:outline-none focus:border-brand-500"
            />
            <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-lg transition">
              Gửi
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-slate-500">
        © 2026 CLOTHES SHOP. All rights reserved. Designed for excellence.
      </div>
    </footer>
  );
}
