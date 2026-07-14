'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import DataTable from '@/components/admin/data-table';
import ConfirmDialog from '@/components/admin/confirm-dialog';
import { useToast } from '@/components/admin/toast';

export default function AdminProductsPage() {
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
    toast('Product deleted');
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
    toast('Product duplicated');
    fetchProducts(search, 1);
  };

  const columns = [
    { key: 'name', label: 'Name', render: (p) => {
      const n = JSON.parse(p.name);
      return <span className="font-medium text-ocean">{n.en || n.zh || '(unnamed)'}</span>;
    }},
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (p) => <span className="text-gold font-medium">${p.price.toLocaleString()}</span> },
    { key: 'stock', label: 'Stock' },
    {
      key: 'actions', label: '',
      render: (p) => (
        <div className="flex gap-2">
          <Link href={`/${locale}/admin/products/${p.id}`} className="text-gold hover:underline text-xs">Edit</Link>
          <button onClick={() => handleDuplicate(p)} className="text-zinc-400 hover:text-zinc-600 text-xs">Copy</button>
          <button onClick={() => setDeleteId(p.id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
        </div>
      ),
    },
  ];

  if (authLoading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-24 text-zinc-500">Access denied.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light text-ocean">Products</h1>
        <Link href={`/${locale}/admin/products/new`} className="bg-ocean text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ocean-light transition-colors">+ Add Product</Link>
      </div>

      <input
        type="text" placeholder="Search by name or slug..."
        value={search}
        onChange={e => { setSearch(e.target.value); fetchProducts(e.target.value, 1); }}
        className="w-full sm:w-72 border border-zinc-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gold"
      />

      <DataTable columns={columns} data={products} loading={loading} emptyText="No products found." total={total} page={page} limit={20} onSearch={(q, p) => fetchProducts(q || search, p)} />

      <ConfirmDialog open={!!deleteId} title="Delete Product" message="Are you sure you want to delete this product? This cannot be undone." confirmText="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
