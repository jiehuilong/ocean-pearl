'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import WishlistButton from './wishlist-button';
import { useCurrency } from './currency-switcher';
import { convertPrice } from '@/lib/currency';

export default function ProductCard({ product }) {
  const locale = useLocale();
  const { currency } = useCurrency();
  const price = convertPrice(product.price, currency);

  return (
    <div className="group relative">
      <WishlistButton slug={product.slug} />
      <Link href={`/${locale}/products/${product.slug}`}>
        <div className="aspect-square bg-pearl rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-pearl to-pearl-dark flex items-center justify-center text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-40">
              <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5"/>
            </svg>
          </div>
        </div>
        <h3 className="font-medium text-sm text-zinc-800 group-hover:text-gold transition-colors">
          {product.name[locale] || product.name.en}
        </h3>
        <p className="text-gold font-semibold text-sm mt-1">
          {price.formatted}
          {product.compareAt && <span className="text-zinc-400 line-through text-xs ml-2">${product.compareAt.toLocaleString()}</span>}
        </p>
      </Link>
    </div>
  );
}
