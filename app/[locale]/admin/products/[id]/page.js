'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/components/auth-context';
import MultiLangField from '@/components/admin/multi-lang-field';
import { useToast } from '@/components/admin/toast';

export default function EditProductPage({ params: { id, locale } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    slug: '', price: '', compareAt: '', category: 'akoya', stock: '99',
    name: { en: '', zh: '', ja: '', fr: '' },
    desc: { en: '', zh: '', ja: '', fr: '' },
    images: '',
  });

  useEffect(() => {
    fetch(`/api/admin/products/${id}`).then(r => r.json()).then(d => {
      if (d.product) {
        const p = d.product;
        setForm({
          slug: p.slug || '',
          price: p.price?.toString() || '',
          compareAt: p.compare_at?.toString() || '',
          category: p.category || 'akoya',
          stock: p.stock?.toString() || '99',
          name: JSON.parse(p.name || '{}'),
          desc: JSON.parse(p.description || '{}'),
          images: JSON.parse(p.images || '[]').join(', '),
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
        stock: parseInt(form.stock),
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      }),
    });
    if (res.ok) {
      toast('Product updated');
      router.push(`/${locale}/admin/products`);
    }
    setSaving(false);
  };

  if (authLoading || loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-24 text-zinc-500">Access denied.</div>;

  const Field = ({ label, field, type = 'text' }) => (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>
      <input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))}
        className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
    </div>
  );

  return (
    <div>
      <Link href={`/${locale}/admin/products`} className="text-sm text-gold hover:underline mb-4 inline-block">← Back to Products</Link>
      <h1 className="text-2xl font-light text-ocean mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug" field="slug" />
          <Field label="Category" field="category" />
          <Field label="Price (USD)" field="price" type="number" />
          <Field label="Compare At" field="compareAt" type="number" />
          <Field label="Stock" field="stock" type="number" />
        </div>

        <MultiLangField label="Product Name" values={form.name} onChange={v => setForm(f => ({...f, name: v}))} />
        <MultiLangField label="Description" values={form.desc} onChange={v => setForm(f => ({...f, desc: v}))} type="textarea" rows={3} />
        <Field label="Image URLs (comma separated)" field="images" />

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-ocean text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-ocean-light transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/${locale}/admin/products`}
            className="px-6 py-2.5 border border-zinc-300 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
