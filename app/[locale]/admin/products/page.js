'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import DataTable from '@/components/admin/data-table';
import ConfirmDialog from '@/components/admin/confirm-dialog';
import { useToast } from '@/components/admin/toast';

export default function AdminProductsPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async (q, p) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: q || '', page: p || 1 });
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(search, 1); }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    toast(t('product_deleted'));
    fetchProducts(search, 1);
  };

  const handleDuplicate = async (p) => {
    const name = JSON.parse(p.name);
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: p.slug + '-copy', price: p.price, category: p.category, stock: p.stock,
        name: Object.fromEntries(Object.entries(name).map(([k, v]) => [k, v + ' (Copy)'])),
        description: JSON.parse(p.description || '{}'),
        specs: JSON.parse(p.specs || '{}'),
      }),
    });
    toast(t('product_duplicated'));
    fetchProducts(search, 1);
  };

  const columns = [
    { key: 'name', label: t('products'), render: (p) => {
      const n = JSON.parse(p.name);
      return <span className="font-medium text-ocean">{n.en || n.zh || '(unnamed)'}</span>;
    }},
    { key: 'category', label: t('category') },
    { key: 'price', label: t('price'), render: (p) => <span className="text-gold font-medium">${p.price.toLocaleString()}</span> },
    { key: 'stock', label: t('stock') },
    {
      key: 'actions', label: '',
      render: (p) => (
        <div className="flex gap-2">
          <Link href={`/${locale}/admin/products/${p.id}`} className="text-gold hover:underline text-xs">{t('edit_product')}</Link>
          <button onClick={() => handleDuplicate(p)} className="text-zinc-400 hover:text-zinc-600 text-xs">{t('duplicate')}</button>
          <button onClick={() => setDeleteId(p.id)} className="text-red-500 hover:text-red-700 text-xs">{t('delete')}</button>
        </div>
      ),
    },
  ];

  if (authLoading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-24"><p className="text-zinc-500">{t('access_denied')}</p></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light text-ocean">{t('products')}</h1>
        <div className="flex gap-2">
          <a href="/api/admin/export/products" className="text-xs bg-zinc-100 px-3 py-2 rounded hover:bg-zinc-200 transition-colors">Export CSV</a>
          <Link href={`/${locale}/admin/products/new`} className="bg-ocean text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ocean-light transition-colors">{t('add_product')}</Link>
        </div>
      </div>
      <input type="text" placeholder={t('search_name_slug')} value={search}
        onChange={e => { setSearch(e.target.value); fetchProducts(e.target.value, 1); }}
        className="w-full sm:w-72 border border-zinc-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gold" />
      <DataTable columns={columns} data={products} loading={loading} emptyText={t('no_products')} total={total} page={page} limit={20}
        onSearch={(q, p) => fetchProducts(q || search, p)} searchPlaceholder={t('search')} />
      <ConfirmDialog open={!!deleteId} title={t('delete_title')} message={t('confirm_delete')} confirmText={t('delete')} danger
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
