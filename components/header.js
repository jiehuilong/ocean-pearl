'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './language-switcher';
import CartIcon from './cart-icon';
import { useAuth } from './auth-context';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-semibold tracking-wide text-ocean">
          <span className="text-gold">✦</span> Ocean Pearl
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link href={`/${locale}`} className="hover:text-gold transition-colors">{t('home')}</Link>
          <Link href={`/${locale}/products`} className="hover:text-gold transition-colors">{t('products')}</Link>
          <Link href={`/${locale}/about`} className="hover:text-gold transition-colors">{t('about')}</Link>
          <Link href={`/${locale}/contact`} className="hover:text-gold transition-colors">{t('contact')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              {user.role === 'ADMIN' && (
                <Link href={`/${locale}/admin`} className="text-gold font-medium hover:underline">Admin</Link>
              )}
              <Link href={`/${locale}/account`} className="text-zinc-600 hover:text-gold transition-colors">{user.name}</Link>
              <button onClick={logout} className="text-zinc-400 hover:text-red-500 transition-colors text-xs">Logout</button>
            </div>
          ) : (
            <Link href={`/${locale}/login`} className="text-sm text-zinc-600 hover:text-gold transition-colors">Sign In</Link>
          )}
          <CartIcon locale={locale} />
        </div>
      </div>
    </header>
  );
}
