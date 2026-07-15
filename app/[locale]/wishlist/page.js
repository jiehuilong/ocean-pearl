'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useWishlist } from '@/components/wishlist-context';
import ProductCard from '@/components/product-card';
import { useState, useEffect } from 'react';

export default function WishlistPage() {
  const locale = useLocale();
  const { items } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (items.length === 0) { setProducts([]); return; }
    fetch(`/api/products/search?q=&locale=${locale}`)
      .then(r => r.json())
      .then(d => setProducts(d.products.filter(p => items.includes(p.slug))))
      .catch(() => {});
  }, [items, locale]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean mb-8">My Wishlist</h1>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 mb-4">Your wishlist is empty.</p>
          <Link href={`/${locale}/products`} className="inline-block bg-ocean text-white px-6 py-2.5 rounded-full text-sm font-medium">Browse Pearls</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">{products.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      )}
    </div>
  );
}
