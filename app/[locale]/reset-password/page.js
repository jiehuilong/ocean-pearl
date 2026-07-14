'use client';

import { useState, Suspense } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetForm() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { setError('Invalid reset link'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) setDone(true);
      else { const d = await res.json(); setError(d.error); }
    } catch { setError('Something went wrong'); }
    finally { setLoading(false); }
  };

  if (done) return <div className="text-center"><p className="text-green-600 mb-4">Password updated! You can now sign in.</p><Link href={`/${locale}/login`} className="text-gold hover:underline">Sign In</Link></div>;
  if (!token) return <div className="text-center"><p className="text-red-500 mb-4">Invalid or expired reset link.</p><Link href={`/${locale}/forgot-password`} className="text-gold hover:underline">Request a new one</Link></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">New Password</label>
        <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-ocean text-white py-2.5 rounded-lg text-sm font-medium hover:bg-ocean-light disabled:opacity-50">
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-light text-ocean text-center mb-8">Set New Password</h1>
      <Suspense fallback={<div className="text-center text-zinc-400">Loading...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
