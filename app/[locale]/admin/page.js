'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json()),
    ]).then(([pData, oData]) => {
      const products = pData.products || [];
      const orders = oData.orders || [];
      setStats({
        products: products.length,
        orders: orders.length,
        revenue: orders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0),
        pending: orders.filter(o => o.status === 'PENDING').length,
      });
    }).catch(() => {});
  }, []);

  if (loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-24"><p className="text-zinc-500">{t('access_denied')}</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-light text-ocean mb-8">{t('dashboard')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: t('products'), value: stats?.products ?? '—', href: `/${locale}/admin/products` },
          { label: t('orders'), value: stats?.orders ?? '—', href: `/${locale}/admin/orders` },
          { label: t('pending'), value: stats?.pending ?? '—', href: `/${locale}/admin/orders` },
          { label: t('revenue'), value: stats ? `$${stats.revenue.toLocaleString()}` : '—', href: `/${locale}/admin/orders` },
        ].map(s => (
          <Link key={s.label} href={s.href} className="bg-pearl rounded-xl p-6 hover:shadow-sm transition-shadow">
            <p className="text-2xl font-semibold text-ocean">{s.value}</p>
            <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
