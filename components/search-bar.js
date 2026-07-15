'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function SearchBar({ className = '' }) {
  const [q, setQ] = useState('');
  const locale = useLocale();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) window.location.href = `/${locale}/search?q=${encodeURIComponent(q.trim())}`;
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input type="text" value={q} onChange={e => setQ(e.target.value)}
        placeholder="Search pearls..."
        className="w-full border border-zinc-300 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:border-gold"
      />
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </form>
  );
}
