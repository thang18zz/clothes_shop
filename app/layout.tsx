import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'CLOTHES SHOP | Thời Trang Nam Nữ Tinh Tế & Hiện Đại',
  description: 'Thương hiệu thời trang chất lượng cao. Áo thun cotton đặn 280GSM, áo sơ mi Linen cao cấp, quần jeans vintage.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
