'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from './cart-context';

export default function CheckoutForm() {
  const t = useTranslations('checkout');
  const { totalPrice, items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', country: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ slug: i.slug, name: i.name, price: i.price, quantity: i.quantity })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const fields = [
    { key: 'name', type: 'text' },
    { key: 'email', type: 'email' },
    { key: 'phone', type: 'tel' },
    { key: 'address', type: 'text' },
    { key: 'city', type: 'text' },
    { key: 'country', type: 'text' },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="space-y-4 mb-6">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-zinc-700 mb-1">{t(f.key)}</label>
            <input
              type={f.type}
              required={f.key !== 'phone'}
              value={form[f.key]}
              onChange={handleChange(f.key)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>{t('total')}</span>
          <span className="text-gold">${totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full bg-ocean text-white py-3 rounded-lg font-medium hover:bg-ocean-light transition-colors disabled:opacity-50"
      >
        {loading ? t('processing') : t('pay')}
      </button>
    </form>
  );
}
