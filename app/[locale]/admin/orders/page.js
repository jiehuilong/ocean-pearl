'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import StatusBadge from '@/components/admin/status-badge';

const STATUSES = ['', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const locale = useLocale();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async (q, status, p) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: q || '', status: status || '', page: p || 1 });
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(search, statusFilter, 1); }, [fetchOrders]);

  const totalPages = Math.ceil(total / 15);

  if (authLoading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-24 text-zinc-500">Access denied.</div>;

  return (
    <div>
      <h1 className="text-2xl font-light text-ocean mb-6">Orders</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <input type="text" placeholder="Search by order ID, customer..."
          value={search}
          onChange={e => { setSearch(e.target.value); fetchOrders(e.target.value, statusFilter, 1); }}
          className="flex-1 sm:flex-none sm:w-64 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); fetchOrders(search, s, 1); }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-ocean text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-zinc-100 rounded animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">No orders found.</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Link key={order.id} href={`/${locale}/admin/orders/${order.id}`}
              className="block border border-zinc-200 rounded-lg p-4 hover:border-gold transition-colors">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div>
                  <span className="text-xs text-zinc-400">#{order.id.slice(0, 8)}</span>
                  <span className="text-sm text-zinc-500 ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">{order.user?.name || 'Guest'} ({order.user?.email || '—'})</span>
                <span className="text-gold font-semibold">${order.total.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 text-sm text-zinc-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => fetchOrders(search, statusFilter, page - 1)}
              className="px-3 py-1 border border-zinc-300 rounded hover:bg-zinc-50 disabled:opacity-30">Prev</button>
            <button disabled={page >= totalPages} onClick={() => fetchOrders(search, statusFilter, page + 1)}
              className="px-3 py-1 border border-zinc-300 rounded hover:bg-zinc-50 disabled:opacity-30">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
