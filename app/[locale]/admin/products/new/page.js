'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/components/auth-context';
import MultiLangField from '@/components/admin/multi-lang-field';
import { useToast } from '@/components/admin/toast';

export default function NewProductPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();
  const { user, loading } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: '', price: '', compareAt: '', category: 'akoya', stock: '99',
    name: { en: '', zh: '', ja: '', fr: '' },
    desc: { en: '', zh: '', ja: '', fr: '' },
    images: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: form.slug,
        price: parseFloat(form.price),
        compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
        category: form.category,
        stock: parseInt(form.stock),
        name: form.name,
        description: form.desc,
        specs: {},
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      }),
    });
    if (res.ok) {
      toast(t('product_created'));
      router.push(`/${locale}/admin/products`);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-24"><p className="text-zinc-500">{t('access_denied')}</p></div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-light text-ocean mb-6">{t('add_product')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-zinc-700 mb-1">{t('slug')}</label>
            <input type="text" required value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" /></div>
          <div><label className="block text-sm font-medium text-zinc-700 mb-1">{t('category')}</label>
            <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold">
              <option value="akoya">Akoya</option><option value="freshwater">Freshwater</option><option value="southsea">South Sea</option>
            </select></div>
          <div><label className="block text-sm font-medium text-zinc-700 mb-1">{t('price')}</label>
            <input type="number" required value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" /></div>
          <div><label className="block text-sm font-medium text-zinc-700 mb-1">{t('compare_at')}</label>
            <input type="number" value={form.compareAt} onChange={e => setForm(f => ({...f, compareAt: e.target.value}))}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" /></div>
          <div><label className="block text-sm font-medium text-zinc-700 mb-1">{t('stock')}</label>
            <input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" /></div>
        </div>
        <MultiLangField label="Name" values={form.name} onChange={v => setForm(f => ({...f, name: v}))} />
        <MultiLangField label="Description" values={form.desc} onChange={v => setForm(f => ({...f, desc: v}))} type="textarea" rows={3} />
        <div><label className="block text-sm font-medium text-zinc-700 mb-1">{t('image_urls')}</label>
          <input type="text" value={form.images} onChange={e => setForm(f => ({...f, images: e.target.value}))}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" /></div>
        <button type="submit" disabled={saving}
          className="bg-ocean text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-ocean-light transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : t('add_product')}</button>
      </form>
    </div>
  );
}
