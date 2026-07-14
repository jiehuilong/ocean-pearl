'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-ocean mb-4">{t('title')}</h1>
        <p className="text-zinc-500">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">{t('name')}</label>
            <input type="text" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">{t('email')}</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">{t('message')}</label>
            <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none" />
          </div>
          <button type="submit" disabled={status === 'loading'}
            className="w-full bg-ocean text-white py-2.5 rounded-lg text-sm font-medium hover:bg-ocean-light transition-colors disabled:opacity-50">
            {status === 'loading' ? t('sending') : t('send')}
          </button>
          {status === 'success' && <p className="text-green-600 text-sm text-center">{t('success')}</p>}
          {status === 'error' && <p className="text-red-500 text-sm text-center">{t('error')}</p>}
        </form>

        <div className="flex flex-col justify-center">
          <div className="bg-pearl rounded-xl p-8">
            <h3 className="font-medium text-ocean mb-4">{t('info')}</h3>
            <div className="space-y-3 text-sm text-zinc-600">
              <p><span className="font-medium">{t('email_us')}:</span> hello@oceanpearl.com</p>
              <p><span className="font-medium">{t('whatsapp')}:</span> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
