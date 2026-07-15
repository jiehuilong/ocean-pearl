'use client';

import CheckoutForm from '@/components/checkout-form';
import { useCart } from '@/components/cart-context';
import { useAuth } from '@/components/auth-context';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function CheckoutPage() {
  const tCart = { empty: 'Your cart is empty', start_shopping: 'Start Shopping' };
  const locale = useLocale();
  const { items } = useCart();
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-zinc-500 mb-6">{tCart.empty}</p>
        <Link href={`/${locale}/products`} className="inline-block bg-ocean text-white px-6 py-2.5 rounded-full text-sm font-medium">{tCart.start_shopping}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean mb-2">Checkout</h1>
      {!user && <p className="text-sm text-zinc-400 mb-6">Checking out as guest. <Link href={`/${locale}/login`} className="text-gold hover:underline">Sign in</Link> for faster checkout.</p>}
      <CheckoutForm />
    </div>
  );
}
