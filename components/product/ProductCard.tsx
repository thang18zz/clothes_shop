'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Product, Color, Size } from '@/lib/types';
import { useCart } from '@/lib/useCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<Color>(product.availableColors[0]);
  const [selectedSize, setSelectedSize] = useState<Size>(product.availableSizes[0]);
  const [isHovered, setIsHovered] = useState(false);

  const displayPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, selectedColor, selectedSize, 1);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
          <Image
            src={
              isHovered && product.images[1]
                ? product.images[1].url
                : product.images[0]?.url || ''
            }
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.isNew && (
              <span className="bg-slate-900 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mới
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 hover:bg-white transition shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          {/* Category */}
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {product.categoryName}
          </p>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Color Swatches */}
          <div className="flex items-center space-x-1.5 pt-1">
            {product.availableColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor.id === color.id
                    ? 'ring-2 ring-brand-500 ring-offset-1 scale-110'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* Size Selector Bar */}
          <div className="flex items-center space-x-1 pt-1">
            {product.availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition ${
                  selectedSize === size
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Pricing & Quick Add CTA */}
      <div className="p-4 pt-0 flex items-center justify-between">
        <div>
          <span className="text-base font-extrabold text-slate-900">
            {displayPrice.toLocaleString('vi-VN')}đ
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through block">
              {product.basePrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          className="px-3 py-2 bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-700 font-semibold rounded-xl text-xs flex items-center space-x-1 transition"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Thêm</span>
        </button>
      </div>
    </div>
  );
}
