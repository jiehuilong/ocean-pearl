'use client';

import { useTranslations } from 'next-intl';
import CheckoutForm from '@/components/checkout-form';
import { useCart } from '@/components/cart-context';
import { useAuth } from '@/components/auth-context';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function CheckoutPage() {
  const tCheckout = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const locale = useLocale();
  const { items } = useCart();
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-zinc-500 mb-4">Please sign in to checkout.</p>
        <Link href={`/${locale}/login`} className="inline-block bg-ocean text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-ocean-light transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-zinc-500 mb-6">{tCart('empty')}</p>
        <Link href={`/${locale}/products`} className="inline-block bg-ocean text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-ocean-light transition-colors">
          {tCart('start_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean mb-8">{tCheckout('title')}</h1>
      <CheckoutForm />
    </div>
  );
}
