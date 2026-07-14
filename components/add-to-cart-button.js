'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from './cart-context';

export default function AddToCartButton({ product }) {
  const t = useTranslations('products');
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex border border-zinc-300 rounded">
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-sm hover:bg-zinc-50 transition-colors">−</button>
        <span className="px-3 py-2 text-sm font-medium min-w-[2rem] text-center">{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-sm hover:bg-zinc-50 transition-colors">+</button>
      </div>
      <button
        onClick={handleAdd}
        className={`flex-1 px-6 py-2.5 rounded text-sm font-medium transition-all ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-ocean text-white hover:bg-ocean-light'
        }`}
      >
        {added ? '✓ ' + t('add_to_cart') : t('add_to_cart')}
      </button>
    </div>
  );
}
