'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { MOCK_PRODUCTS, COLORS } from '@/lib/mockData';
import { Size } from '@/lib/types';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
        return false;
      }
      // Size filter
      if (selectedSize !== 'all' && !product.availableSizes.includes(selectedSize as Size)) {
        return false;
      }
      // Color filter
      if (selectedColor !== 'all' && !product.availableColors.some((c) => c.id === selectedColor)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.basePrice;
      const priceB = b.salePrice ?? b.basePrice;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, selectedSize, selectedColor, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Danh Mục Sản Phẩm</h1>
          <p className="text-slate-500 text-xs mt-1">
            Hiển thị {filteredProducts.length} sản phẩm tương thích với lựa chọn của bạn
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sắp xếp:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800"
          >
            <option value="featured">Nổi Bật Nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh Giá Cao Nhất</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter Controls */}
        <aside className="space-y-6 lg:border-r lg:border-slate-200 lg:pr-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Bộ Lọc Tìm Kiếm</span>
            </h3>
            {(selectedCategory !== 'all' || selectedSize !== 'all' || selectedColor !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-xs text-brand-600 hover:underline flex items-center space-x-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Danh Mục</h4>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', name: 'Tất Cả Danh Mục' },
                { id: 'cat-so-mi', name: 'Áo Sơ Mi' },
                { id: 'cat-ao-thun', name: 'Áo Thun Cotton' },
                { id: 'cat-quan', name: 'Quần Jeans' },
                { id: 'cat-ao-khoac', name: 'Áo Khoác Blazer' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                    selectedCategory === cat.id
                      ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Kích Cỡ (Size)</h4>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                    selectedSize === sz
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {sz === 'all' ? 'Tất cả' : sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Màu Sắc</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedColor('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                  selectedColor === 'all'
                    ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tất cả màu
              </button>
              {Object.values(COLORS).map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition ${
                    selectedColor === color.id
                      ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-100 space-y-4">
              <p className="text-slate-700 font-semibold">Không tìm thấy sản phẩm phù hợp</p>
              <p className="text-xs text-slate-400">Hãy thử thay đổi kích cỡ, màu sắc hoặc chọn Đặt lại bộ lọc.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-brand-600 text-white font-semibold text-xs rounded-lg shadow"
              >
                Đặt Lại Bộ Lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
