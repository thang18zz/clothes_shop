'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, Ruler, Truck, RotateCcw, ShoppingBag, Check, Heart } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { Color, Size } from '@/lib/types';
import { useCart } from '@/lib/useCart';
import SizeChartModal from '@/components/product/SizeChartModal';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug) || MOCK_PRODUCTS[0];
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]?.url || '');
  const [selectedColor, setSelectedColor] = useState<Color>(product.availableColors[0]);
  const [selectedSize, setSelectedSize] = useState<Size>(product.availableSizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const displayPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

  // Find variant matching selection
  const matchingVariant = product.variants.find(
    (v) => v.color.id === selectedColor.id && v.size === selectedSize
  );
  const stockAvailable = matchingVariant?.stockAvailable ?? 10;

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Main Grid: Gallery & Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
            <Image
              src={selectedImage || product.images[0]?.url || ''}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImage === img.url ? 'border-brand-600 ring-2 ring-brand-500/30' : 'border-slate-200'
                  }`}
                >
                  <Image src={img.url} alt={img.alt} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta & Purchase Panel */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              {product.brandName} • {product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{product.name}</h1>

            {/* Rating & Reviews */}
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-slate-800 ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewCount} đánh giá từ người mua thực)</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="flex items-baseline space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-2xl sm:text-3xl font-black text-brand-700">
              {displayPrice.toLocaleString('vi-VN')}đ
            </span>
            {hasDiscount && (
              <span className="text-base text-slate-400 line-through">
                {product.basePrice.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase block">
              Màu Sắc: <span className="text-brand-700">{selectedColor.name}</span>
            </label>
            <div className="flex items-center space-x-3">
              {product.availableColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                    selectedColor.id === color.id
                      ? 'border-brand-600 bg-brand-50 text-brand-800 font-bold ring-1 ring-brand-500'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Chart trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase block">Kích Cỡ (Size)</label>
              <button
                onClick={() => setIsSizeChartOpen(true)}
                className="text-xs text-brand-600 hover:underline flex items-center space-x-1 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Xem Bảng Size Chart</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] py-2 px-3 rounded-lg border text-sm font-bold transition ${
                    selectedSize === size
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Alert */}
          {stockAvailable <= 5 && (
            <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
              ⚠️ Chỉ còn <strong>{stockAvailable} sản phẩm</strong> sẵn có cho biến thể này!
            </p>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
              >
                -
              </button>
              <span className="px-4 py-1 text-sm font-bold text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 font-bold rounded-xl flex items-center justify-center space-x-2 transition shadow-lg ${
                addedSuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Đã Thêm Vào Giỏ Hàng!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </>
              )}
            </button>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-600">
            <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Giao hàng 1-2 ngày</span>
            </div>
            <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <RotateCcw className="w-4 h-4 text-brand-600" />
              <span>Đổi size 15 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Tabs & Care Instructions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Chi Tiết Sản Phẩm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800">Mô Tả Sản Phẩm</h4>
            <p>{product.description}</p>
            {product.material && (
              <p>
                <strong>Chất liệu:</strong> {product.material}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800">Hướng Dẫn Bảo Quản</h4>
            <p>{product.careInstructions || 'Giặt nhẹ với nước lạnh, phơi trong bóng râm.'}</p>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </div>
  );
}
