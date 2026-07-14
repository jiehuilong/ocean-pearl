'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/components/cart-context';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-zinc-300 mb-4">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p className="text-zinc-500 mb-6">{t('empty')}</p>
        <Link href={`/${locale}/products`} className="inline-block bg-ocean text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-ocean-light transition-colors">
          {t('start_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean mb-8">{t('title')}</h1>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.slug} className="flex items-center gap-4 bg-zinc-50 rounded-lg p-4">
            <div className="w-16 h-16 bg-pearl rounded flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-zinc-800 truncate">{item.name?.en || item.name?.[locale] || item.name}</p>
              <p className="text-gold font-semibold text-sm">${item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center border border-zinc-300 rounded">
              <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="px-2.5 py-1 text-sm hover:bg-zinc-100">−</button>
              <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="px-2.5 py-1 text-sm hover:bg-zinc-100">+</button>
            </div>
            <p className="font-medium text-sm w-20 text-right">${(item.price * item.quantity).toLocaleString()}</p>
            <button onClick={() => removeItem(item.slug)} className="text-zinc-400 hover:text-red-500 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href={`/${locale}/products`} className="text-sm text-zinc-500 hover:text-gold transition-colors">{t('continue')}</Link>
        <div className="text-right">
          <p className="text-lg font-semibold">{t('total')}: <span className="text-gold">${totalPrice.toLocaleString()}</span></p>
          <Link
            href={`/${locale}/checkout`}
            className="inline-block mt-3 bg-ocean text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-ocean-light transition-colors"
          >
            {t('checkout')}
          </Link>
        </div>
      </div>
    </div>
  );
}
