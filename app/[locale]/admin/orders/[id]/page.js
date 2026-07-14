'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import StatusBadge from '@/components/admin/status-badge';
import { useToast } from '@/components/admin/toast';

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrderDetailPage({ params: { id, locale } }) {
  const t = useTranslations('admin');
  const { user: authUser, loading: authLoading } = useAuth();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then(r => r.json()).then(d => {
      if (d.order) setOrder(d.order);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    setOrder(prev => ({ ...prev, status }));
    toast(t('order_updated', { status }));
  };

  if (authLoading || loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!authUser || authUser.role !== 'ADMIN') return <div className="text-center py-24"><p className="text-zinc-500">{t('access_denied')}</p></div>;
  if (!order) return <div className="text-center py-24 text-zinc-500">Order not found.</div>;

  return (
    <div>
      <Link href={`/${locale}/admin/orders`} className="text-sm text-gold hover:underline mb-4 inline-block">← {t('orders')}</Link>
      <h1 className="text-2xl font-light text-ocean mb-6">#{order.id.slice(0, 8)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border border-zinc-200 rounded-xl p-6">
          <h2 className="font-medium text-ocean mb-4">{t('order_info')}</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <dt className="w-24 text-zinc-400">{t('status')}</dt>
              <select value={order.status} onChange={e => updateStatus(e.target.value)}
                className="border border-zinc-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-gold">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex"><dt className="w-24 text-zinc-400">{t('date')}</dt><dd>{new Date(order.createdAt).toLocaleString()}</dd></div>
            {order.stripeSessionId && <div className="flex"><dt className="w-24 text-zinc-400">{t('payment')}</dt><dd className="text-xs truncate">{order.stripeSessionId}</dd></div>}
          </dl>
        </div>

        <div className="border border-zinc-200 rounded-xl p-6">
          <h2 className="font-medium text-ocean mb-4">{t('customer')}</h2>
          {order.user ? (
            <dl className="space-y-3 text-sm">
              <div className="flex"><dt className="w-20 text-zinc-400">Name</dt><dd>{order.user.name}</dd></div>
              <div className="flex"><dt className="w-20 text-zinc-400">Email</dt><dd>{order.user.email}</dd></div>
            </dl>
          ) : <p className="text-sm text-zinc-400">Guest checkout</p>}
          {order.shipping?.name && (
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <h3 className="text-xs font-medium text-zinc-400 mb-2">{t('shipping_address')}</h3>
              <p className="text-sm">{order.shipping.name}<br />{order.shipping.address}<br />{order.shipping.city}, {order.shipping.country}</p>
            </div>
          )}
        </div>
      </div>

      <div className="border border-zinc-200 rounded-xl p-6 mb-6">
        <h2 className="font-medium text-ocean mb-4">{t('items')}</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-zinc-200 text-left text-zinc-400">
            <th className="pb-2">{t('products')}</th><th className="pb-2">{t('price')}</th><th className="pb-2">{t('qty')}</th><th className="pb-2 text-right">{t('subtotal')}</th>
          </tr></thead>
          <tbody>
            {order.items?.map(item => (
              <tr key={item.id} className="border-b border-zinc-100">
                <td className="py-2">{item.productName}</td>
                <td className="py-2">${item.price.toLocaleString()}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2 text-right">${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan="3" className="pt-3 text-right font-medium">{t('total')}</td>
              <td className="pt-3 text-right font-semibold text-gold">${order.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
