'use client';

import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const pathname = usePathname();

  const switchLanguage = (newLocale) => {
    // Replace the locale prefix in the URL and do a hard navigation
    const segments = pathname.split('/');
    if (locales.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    window.location.href = segments.join('/') || `/${newLocale}`;
  };

  return (
    <select
      value={locale}
      onChange={(e) => switchLanguage(e.target.value)}
      className="text-sm bg-transparent border border-zinc-300 rounded px-2 py-1 focus:outline-none focus:border-gold cursor-pointer"
      aria-label="Language selector"
    >
      {locales.map(l => (
        <option key={l} value={l}>{t(l)}</option>
      ))}
    </select>
  );
}
