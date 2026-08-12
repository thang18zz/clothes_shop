import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.isFeatured);

  return (
    <div className="space-y-16 pb-16">
      {/* Task-First Hero Banner */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
            alt="Fashion studio background"
            fill
            priority
            className="object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-brand-600/30 border border-brand-500/50 backdrop-blur-md px-4 py-1.5 rounded-full text-brand-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Bộ Sưu Tập Mùa Thu 2026 Mới Ra Mắt</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            ĐỊNH HÌNH PHONG CÁCH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-amber-200 to-brand-500">
              MINIMAL & TINH TẾ
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm md:text-base leading-relaxed">
            Khám phá những mẫu thiết kế chú trọng chất liệu vải sợi tự nhiên: Linen thoáng mát, Cotton Heavyweight đứng phom. Tối giản trong từng đường kim mũi chỉ.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition transform hover:-translate-y-0.5"
            >
              <span>Xem Tất Cả Sản Phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products?category=ao-so-mi"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-md border border-white/20 transition"
            >
              BST Áo Sơ Mi Linen
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Danh Mục Nổi Bật</h2>
            <p className="text-slate-500 text-xs mt-1">Lựa chọn trang phục theo nhu cầu phong cách của bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: 'Áo Sơ Mi', slug: 'ao-so-mi', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop' },
            { title: 'Áo Thun Cotton', slug: 'ao-thun', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop' },
            { title: 'Quần Jeans', slug: 'quan-jeans', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop' },
            { title: 'Áo Khoác Blazer', slug: 'ao-khoac', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
            >
              <Image
                src={cat.img}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-base group-hover:text-brand-300 transition">
                  {cat.title} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Lựa Chọn Nhiều Nhất</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Sản Phẩm Bán Chạy</h2>
          </div>
          <Link href="/products" className="text-xs font-bold text-brand-600 hover:text-brand-800 transition flex items-center space-x-1">
            <span>Xem thêm ({MOCK_PRODUCTS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Special Offer Voucher Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-3 z-10 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs px-3 py-1 rounded-full font-bold">
              <Tag className="w-3.5 h-3.5" />
              <span>Ưu Đãi Khách Hàng Mới</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black">Nhận Ngay Mã Giảm 10% Cho Đơn Hàng Đầu Tiên</h3>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl">
              Nhập mã <code className="bg-white/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">WELCOME10</code> tại bước thanh toán để áp dụng ưu đãi ngay lập tức.
            </p>
          </div>

          <Link
            href="/products"
            className="z-10 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg transition whitespace-nowrap"
          >
            Mua Sắm Ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
