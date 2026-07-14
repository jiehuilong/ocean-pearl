'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const sections = [
  { key: 'dashboard', icon: '📊', href: '/admin' },
  { key: 'products', icon: '📦', href: '/admin/products' },
  { key: 'orders', icon: '📋', href: '/admin/orders' },
  { key: 'users', icon: '👥', href: '/admin/users' },
  { key: 'audit_log', icon: '📜', href: '/admin/audit-log' },
];

export default function AdminSidebar({ locale }) {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`);

  return (
    <>
      <button onClick={() => setOpen(!open)} className="md:hidden fixed top-4 left-4 z-50 bg-ocean text-white p-2 rounded-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      {open && <div className="md:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-ocean text-zinc-300 flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 border-b border-zinc-700">
          <Link href={`/${locale}/admin`} className="text-white font-semibold text-lg"><span className="text-gold">✦</span> Admin</Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sections.map(s => (
            <Link key={s.key} href={`/${locale}${s.href}`} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(s.href) ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
              <span>{s.icon}</span> {t(s.key)}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-700">
          <Link href={`/${locale}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:text-white transition-colors"><span>🔙</span> {t('back_to_store')}</Link>
        </div>
      </aside>
    </>
  );
}
