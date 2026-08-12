import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Color, Size, Coupon } from './types';
import { MOCK_COUPONS } from './mockData';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isCartDrawerOpen: boolean;
  
  // Actions
  addItem: (product: Product, selectedColor: Color, selectedSize: Size, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setCartDrawerOpen: (isOpen: boolean) => void;

  // Computed values
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isCartDrawerOpen: false,

      addItem: (product, selectedColor, selectedSize, quantity = 1) => {
        // Construct unique variant ID key
        const variantId = `${product.id}-${selectedColor.id}-${selectedSize}`;
        const unitPrice = product.salePrice ?? product.basePrice;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.variantId === variantId);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems, isCartDrawerOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                variantId,
                product,
                selectedColor,
                selectedSize,
                quantity,
                unitPrice
              }
            ],
            isCartDrawerOpen: true
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId)
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (code) => {
        const found = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
        if (!found) {
          return { success: false, message: 'Mã giảm giá không hợp lệ' };
        }

        const subtotal = get().getSubtotal();
        if (subtotal < found.minOrderValue) {
          return {
            success: false,
            message: `Mã áp dụng cho đơn từ ${found.minOrderValue.toLocaleString('vi-VN')}đ`
          };
        }

        set({ appliedCoupon: found });
        return { success: true, message: 'Áp dụng mã giảm giá thành công!' };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      setCartDrawerOpen: (isOpen) => set({ isCartDrawerOpen: isOpen }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();

        if (coupon.discountType === 'percentage') {
          return (subtotal * coupon.value) / 100;
        }
        return Math.min(coupon.value, subtotal);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal - discount);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      }
    }),
    {
      name: 'clothes-shop-cart-storage'
    }
  )
);
