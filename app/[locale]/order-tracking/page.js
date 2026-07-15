'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function OrderTrackingPage() {
  const locale = useLocale();
  const [form, setForm] = useState({ orderId: '', email: '' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/lookup?orderId=${encodeURIComponent(form.orderId)}&email=${encodeURIComponent(form.email)}`);
      if (!res.ok) { setError('Order not found. Check your order ID and email.'); return; }
      const data = await res.json();
      setOrder(data.order);
    } catch { setError('Something went wrong. Try again.'); }
    finally { setLoading(false); }
  };

  const statusColors = { PENDING: 'bg-yellow-100 text-yellow-800', PAID: 'bg-green-100 text-green-800', SHIPPED: 'bg-blue-100 text-blue-800', DELIVERED: 'bg-zinc-100 text-zinc-800', CANCELLED: 'bg-red-100 text-red-800' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean text-center mb-2">Track Your Order</h1>
      <p className="text-zinc-500 text-center mb-8">Enter your order ID and email to check status.</p>

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4 mb-12">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Order ID</label>
          <input type="text" required placeholder="e.g. a7x1j4ah" value={form.orderId} onChange={e => setForm(f => ({...f, orderId: e.target.value}))}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
          <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-ocean text-white py-2.5 rounded-lg text-sm font-medium hover:bg-ocean-light disabled:opacity-50">
          {loading ? 'Searching...' : 'Track Order'}
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>

      {order && (
        <div className="border border-zinc-200 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-zinc-400">Order #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-zinc-100'}`}>{order.status}</span>
          </div>
          <div className="space-y-2 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.productName} × {item.quantity}</span>
                <span className="text-zinc-600">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-100 pt-3 flex justify-between text-sm font-medium">
            <span>Total</span>
            <span className="text-gold">${order.total.toLocaleString()}</span>
          </div>
          {order.shipping?.name && (
            <div className="mt-4 pt-4 border-t border-zinc-100 text-sm">
              <p className="text-zinc-400 text-xs mb-1">Shipping to</p>
              <p className="text-zinc-600">{order.shipping.name}<br />{order.shipping.address}<br />{order.shipping.city}, {order.shipping.country}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
