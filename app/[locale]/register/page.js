'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/components/auth-context';

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      router.push(`/${locale}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-light text-ocean text-center mb-8">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
          <input type="text" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
          <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-ocean text-white py-2.5 rounded-lg text-sm font-medium hover:bg-ocean-light transition-colors disabled:opacity-50">
          {loading ? 'Loading...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-zinc-500 mt-6">
        Already have an account?{' '}
        <Link href={`/${locale}/login`} className="text-gold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
