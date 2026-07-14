'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import StatusBadge from '@/components/admin/status-badge';
import { useToast } from '@/components/admin/toast';

export default function UserDetailPage({ params: { id, locale } }) {
  const t = useTranslations('admin');
  const { user: authUser, loading: authLoading } = useAuth();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`).then(r => r.json()).then(d => {
      if (d.user) setUser(d.user);
      if (d.orders) setOrders(d.orders);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const updateRole = async (role) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }),
    });
    setUser(prev => ({ ...prev, role }));
    toast(t('user_role_updated'));
  };

  if (authLoading || loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!authUser || authUser.role !== 'ADMIN') return <div className="text-center py-24"><p className="text-zinc-500">{t('access_denied')}</p></div>;
  if (!user) return <div className="text-center py-24 text-zinc-500">User not found.</div>;

  return (
    <div>
      <Link href={`/${locale}/admin/users`} className="text-sm text-gold hover:underline mb-4 inline-block">← {t('users')}</Link>
      <h1 className="text-2xl font-light text-ocean mb-6">{user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border border-zinc-200 rounded-xl p-6">
          <h2 className="font-medium text-ocean mb-4">{t('user_info')}</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex"><dt className="w-20 text-zinc-400">Name</dt><dd>{user.name}</dd></div>
            <div className="flex"><dt className="w-20 text-zinc-400">Email</dt><dd>{user.email}</dd></div>
            <div className="flex items-center gap-2">
              <dt className="w-20 text-zinc-400">{t('role')}</dt>
              <select value={user.role} onChange={e => updateRole(e.target.value)}
                className="border border-zinc-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-gold">
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex"><dt className="w-20 text-zinc-400">{t('joined')}</dt><dd>{new Date(user.created_at).toLocaleDateString()}</dd></div>
          </dl>
        </div>

        <div className="border border-zinc-200 rounded-xl p-6">
          <h2 className="font-medium text-ocean mb-4">{t('orders_count')} ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-zinc-400">{t('no_orders_user')}</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {orders.map(o => (
                <Link key={o.id} href={`/${locale}/admin/orders/${o.id}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-zinc-50 transition-colors">
                  <span className="text-xs text-zinc-500">#{o.id.slice(0, 8)}</span>
                  <span className="text-sm font-medium">${o.total.toLocaleString()}</span>
                  <StatusBadge status={o.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
