'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/components/auth-context';

export default function NewProductPage() {
  const locale = useLocale();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    slug: '', price: '', compareAt: '', category: 'akoya', stock: '99',
    name_en: '', name_zh: '', name_ja: '', name_fr: '',
    desc_en: '', desc_zh: '', desc_ja: '', desc_fr: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: form.slug,
        price: form.price,
        compareAt: form.compareAt || null,
        category: form.category,
        stock: form.stock,
        name: { en: form.name_en, zh: form.name_zh, ja: form.name_ja, fr: form.name_fr },
        description: { en: form.desc_en, zh: form.desc_zh, ja: form.desc_ja, fr: form.desc_fr },
        specs: {},
        images: [],
      }),
    });
    if (res.ok) router.push(`/${locale}/admin/products`);
    setSaving(false);
  };

  if (loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-24 text-zinc-500">Access denied.</div>;

  const Field = ({ label, value, field, type = 'text', required }) => (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} rows={2} required={required}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none" />
      ) : (
        <input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} required={required}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean mb-8">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug" field="slug" required />
          <Field label="Category" field="category" />
          <Field label="Price (USD)" field="price" type="number" required />
          <Field label="Compare At" field="compareAt" type="number" />
          <Field label="Stock" field="stock" type="number" />
        </div>
        <div className="border-t border-zinc-200 pt-4">
          <h3 className="font-medium text-ocean mb-3">Name (per language)</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="English *" field="name_en" required />
            <Field label="中文" field="name_zh" />
            <Field label="日本語" field="name_ja" />
            <Field label="Français" field="name_fr" />
          </div>
        </div>
        <div className="border-t border-zinc-200 pt-4">
          <h3 className="font-medium text-ocean mb-3">Description</h3>
          <div className="space-y-3">
            <Field label="English *" field="desc_en" type="textarea" required />
            <Field label="中文" field="desc_zh" type="textarea" />
            <Field label="日本語" field="desc_ja" type="textarea" />
            <Field label="Français" field="desc_fr" type="textarea" />
          </div>
        </div>
        <button type="submit" disabled={saving}
          className="bg-ocean text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-ocean-light transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
