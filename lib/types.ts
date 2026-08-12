export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: Size;
  color: Color;
  sku: string;
  stockOnHand: number;
  stockReserved: number;
  stockAvailable: number; // stockOnHand - stockReserved
  priceAdjustment?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  colorId?: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  careInstructions?: string;
  material?: string;
  categoryId: string;
  categoryName: string;
  brandName?: string;
  basePrice: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  availableColors: Color[];
  availableSizes: Size[];
}

export interface CartItem {
  variantId: string;
  product: Product;
  selectedColor: Color;
  selectedSize: Size;
  quantity: number;
  unitPrice: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  description: string;
}

export interface ShippingCarrier {
  id: string;
  name: string;
  estimatedDays: string;
  fee: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
}

export type PaymentMethod = 'cod' | 'vnpay' | 'momo' | 'card';
