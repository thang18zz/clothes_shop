import { Product, Color, Coupon, ShippingCarrier } from './types';

export const COLORS: Record<string, Color> = {
  black: { id: 'col-black', name: 'Đen Trầm', hex: '#18181b' },
  white: { id: 'col-white', name: 'Trắng Tinh Khôi', hex: '#f8fafc' },
  navy: { id: 'col-navy', name: 'Xanh Navy', hex: '#1e3a8a' },
  beige: { id: 'col-beige', name: 'Kem Be', hex: '#f5f5dc' },
  olive: { id: 'col-olive', name: 'Xanh Rêu', hex: '#3f6212' },
  terracotta: { id: 'col-terracotta', name: 'Cam Đất', hex: '#9a3412' }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Áo Sơ Mi Linen Form Rộng Premium',
    slug: 'ao-so-mi-linen-form-rong-premium',
    description: 'Áo sơ mi chất liệu 100% Linen tự nhiên thoáng mát, thiết kế phom dáng Oversized hiện đại phù hợp cho cả đi làm và đi chơi. Bề mặt vải có độ nhăn tự nhiên đặc trưng của dòng vải cao cấp.',
    careInstructions: 'Giặt tay hoặc giặt máy chế độ nhẹ với nước lạnh. Phơi trong bóng râm, ủi ở nhiệt độ trung bình khi còn ẩm nhẹ.',
    material: '100% French Linen Premium',
    categoryId: 'cat-so-mi',
    categoryName: 'Áo Sơ Mi',
    brandName: 'CLOTHES SHOP Studio',
    basePrice: 550000,
    salePrice: 450000,
    rating: 4.8,
    reviewCount: 42,
    isNew: true,
    isFeatured: true,
    images: [
      {
        id: 'img-1-1',
        url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
        alt: 'Áo sơ mi linen nam kem be góc chính',
        isPrimary: true
      },
      {
        id: 'img-1-2',
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
        alt: 'Chi tiết chất liệu áo sơ mi linen'
      }
    ],
    availableColors: [COLORS.beige, COLORS.white, COLORS.navy],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'var-1-m-beige', productId: 'prod-1', size: 'M', color: COLORS.beige, sku: 'CS-SM-BEIGE-M', stockOnHand: 15, stockReserved: 2, stockAvailable: 13 },
      { id: 'var-1-l-beige', productId: 'prod-1', size: 'L', color: COLORS.beige, sku: 'CS-SM-BEIGE-L', stockOnHand: 8, stockReserved: 0, stockAvailable: 8 },
      { id: 'var-1-m-white', productId: 'prod-1', size: 'M', color: COLORS.white, sku: 'CS-SM-WHITE-M', stockOnHand: 20, stockReserved: 5, stockAvailable: 15 },
      { id: 'var-1-l-white', productId: 'prod-1', size: 'L', color: COLORS.white, sku: 'CS-SM-WHITE-L', stockOnHand: 4, stockReserved: 1, stockAvailable: 3 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Áo Thun Cotton Heavyweight 280GSM',
    slug: 'ao-thun-cotton-heavyweight-280gsm',
    description: 'Áo thun phông định lượng dày dặn 280GSM đứng phom, bo cổ dệt tổ ong chống dão sau nhiều lần giặt. Xử lý bề mặt chống xù lông.',
    careInstructions: 'Lộn trái khi giặt máy. Không dùng chất tẩy mạnh. Khuyên dùng nước giặt dịu nhẹ.',
    material: '100% Compact Combed Cotton',
    categoryId: 'cat-ao-thun',
    categoryName: 'Áo Thun',
    brandName: 'CLOTHES SHOP Basic',
    basePrice: 320000,
    salePrice: 280000,
    rating: 4.9,
    reviewCount: 128,
    isNew: false,
    isFeatured: true,
    images: [
      {
        id: 'img-2-1',
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
        alt: 'Áo thun cotton đặn đứng phom đen trầm',
        isPrimary: true
      },
      {
        id: 'img-2-2',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
        alt: 'Cận cảnh bo cổ áo thun'
      }
    ],
    availableColors: [COLORS.black, COLORS.white, COLORS.olive],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      { id: 'var-2-m-black', productId: 'prod-2', size: 'M', color: COLORS.black, sku: 'CS-AT-BLACK-M', stockOnHand: 30, stockReserved: 3, stockAvailable: 27 },
      { id: 'var-2-l-black', productId: 'prod-2', size: 'L', color: COLORS.black, sku: 'CS-AT-BLACK-L', stockOnHand: 25, stockReserved: 2, stockAvailable: 23 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Quần Jeans Straight-Fit Classic Vintage',
    slug: 'quan-jeans-straight-fit-classic-vintage',
    description: 'Quần Jeans dáng suông cổ điển, xử lý màu Stonewashed tạo hiệu ứng phai màu Vintage tự nhiên. Khóa kéo YKK độ bền cao.',
    careInstructions: 'Giặt riêng trong 2-3 lần giặt đầu. Lộn trái và phơi nơi thoáng mát.',
    material: '98% Cotton Denim, 2% Elastane',
    categoryId: 'cat-quan',
    categoryName: 'Quần Jeans',
    brandName: 'CLOTHES SHOP Denim',
    basePrice: 680000,
    rating: 4.7,
    reviewCount: 56,
    isNew: true,
    isFeatured: true,
    images: [
      {
        id: 'img-3-1',
        url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
        alt: 'Quần jeans dáng suông phong cách vintage',
        isPrimary: true
      }
    ],
    availableColors: [COLORS.navy, COLORS.black],
    availableSizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'var-3-m-navy', productId: 'prod-3', size: 'M', color: COLORS.navy, sku: 'CS-QJ-NAVY-M', stockOnHand: 12, stockReserved: 1, stockAvailable: 11 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Áo Khoác Blazer Unstructured Linen-Blend',
    slug: 'ao-khoac-blazer-unstructured-linen-blend',
    description: 'Blazer thiết kế không đệm vai (unstructured) tạo vẻ tự nhiên, phóng khoáng nhưng vẫn thanh lịch. Thích hợp mặc khoác nhẹ bốn mùa.',
    careInstructions: 'Nên giặt khô hoặc giặt hấp để giữ phom dáng tốt nhất.',
    material: '55% Linen, 45% Organic Cotton',
    categoryId: 'cat-ao-khoac',
    categoryName: 'Áo Khoác',
    brandName: 'CLOTHES SHOP Studio',
    basePrice: 1250000,
    salePrice: 990000,
    rating: 5.0,
    reviewCount: 19,
    isNew: true,
    isFeatured: false,
    images: [
      {
        id: 'img-4-1',
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
        alt: 'Áo khoác blazer màu olive thanh lịch',
        isPrimary: true
      }
    ],
    availableColors: [COLORS.olive, COLORS.terracotta, COLORS.black],
    availableSizes: ['M', 'L', 'XL'],
    variants: [
      { id: 'var-4-m-olive', productId: 'prod-4', size: 'M', color: COLORS.olive, sku: 'CS-BL-OLIVE-M', stockOnHand: 6, stockReserved: 0, stockAvailable: 6 }
    ]
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    minOrderValue: 300000,
    description: 'Giảm 10% cho đơn hàng từ 300.000đ'
  },
  {
    code: 'FASHION50K',
    discountType: 'fixed',
    value: 50000,
    minOrderValue: 500000,
    description: 'Giảm 50.000đ trực tiếp cho đơn từ 500.000đ'
  }
];

export const SHIPPING_CARRIERS: ShippingCarrier[] = [
  {
    id: 'ghn',
    name: 'Giao Hàng Nhanh (GHN)',
    estimatedDays: '1-2 ngày',
    fee: 30000
  },
  {
    id: 'ghtk',
    name: 'Giao Hàng Tiết Kiệm (GHTK)',
    estimatedDays: '2-3 ngày',
    fee: 25000
  },
  {
    id: 'express',
    name: 'Hỏa Tốc Nội Thành 2H',
    estimatedDays: 'Trong ngày',
    fee: 45000
  }
];
