'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';

export default function AccountPage() {
  const locale = useLocale();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) fetch('/api/orders').then(r => r.json()).then(data => {
      if (data.orders) setOrders(data.orders);
    }).catch(() => {});
  }, [user]);

  if (loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user) return (
    <div className="text-center py-24">
      <p className="text-zinc-500 mb-4">Please sign in to view your account.</p>
      <Link href={`/${locale}/login`} className="inline-block bg-ocean text-white px-6 py-2.5 rounded-full text-sm font-medium">Sign In</Link>
    </div>
  );

  const statusColors = { PENDING: 'bg-yellow-100 text-yellow-800', PAID: 'bg-green-100 text-green-800', SHIPPED: 'bg-blue-100 text-blue-800', DELIVERED: 'bg-zinc-100 text-zinc-800', CANCELLED: 'bg-red-100 text-red-800' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean mb-2">My Account</h1>
      <p className="text-zinc-500 mb-8">Welcome, {user.name}</p>

      <h2 className="text-xl font-light text-ocean mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-zinc-400">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-zinc-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-zinc-400">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-zinc-100'}`}>{order.status}</span>
              </div>
              <div className="space-y-1 mb-2">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.productName} × {item.quantity}</span>
                    <span className="text-zinc-600">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-100 pt-2 flex justify-between text-sm font-medium">
                <span>Total</span>
                <span className="text-gold">${order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
