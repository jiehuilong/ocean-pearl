import { AuthProvider } from '@/components/auth-context';
import { CartProvider } from '@/components/cart-context';
import { WishlistProvider } from '@/components/wishlist-context';
import { CurrencyProvider } from '@/components/currency-switcher';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CookieConsent from '@/components/cookie-consent';

export default function LocaleLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CurrencyProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
          </CurrencyProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
