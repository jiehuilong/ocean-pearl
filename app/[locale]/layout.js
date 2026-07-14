import { AuthProvider } from '@/components/auth-context';
import { CartProvider } from '@/components/cart-context';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function LocaleLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}
