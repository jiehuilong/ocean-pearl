'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/product-card';

function SearchResults() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/products/search?q=${encodeURIComponent(q)}&locale=${locale}`)
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q, locale]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-light text-ocean mb-2">Search results for &ldquo;{q}&rdquo;</h1>
      <p className="text-sm text-zinc-400 mb-8">{products.length} products found</p>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Searching...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">No products found for &ldquo;{q}&rdquo;. Try a different keyword.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return <SearchResults />;
}
