'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useAuth } from '@/components/auth-context';

export default function AdminDashboard() {
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
  if (!user || user.role !== 'ADMIN') return (
    <div className="text-center py-24">
      <p className="text-zinc-500">Access denied. Admin only.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Products', value: stats?.products ?? '—', href: `/${locale}/admin/products` },
          { label: 'Orders', value: stats?.orders ?? '—', href: `/${locale}/admin/orders` },
          { label: 'Pending', value: stats?.pending ?? '—', href: `/${locale}/admin/orders` },
          { label: 'Revenue', value: stats ? `$${stats.revenue.toLocaleString()}` : '—', href: `/${locale}/admin/orders` },
        ].map(s => (
          <Link key={s.label} href={s.href} className="bg-pearl rounded-xl p-6 hover:shadow-sm transition-shadow">
            <p className="text-2xl font-semibold text-ocean">{s.value}</p>
            <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href={`/${locale}/admin/products`} className="border border-zinc-200 rounded-xl p-6 hover:border-gold transition-colors">
          <h2 className="font-medium text-ocean mb-2">Manage Products</h2>
          <p className="text-sm text-zinc-500">Add, edit, or remove products from the catalog.</p>
        </Link>
        <Link href={`/${locale}/admin/orders`} className="border border-zinc-200 rounded-xl p-6 hover:border-gold transition-colors">
          <h2 className="font-medium text-ocean mb-2">Manage Orders</h2>
          <p className="text-sm text-zinc-500">View and update order statuses.</p>
        </Link>
      </div>
    </div>
  );
}
