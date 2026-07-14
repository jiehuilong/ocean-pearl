import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-ocean text-zinc-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">
              <span className="text-gold">✦</span> Ocean Pearl
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Hand-selected natural pearls from the world's purest waters.
              Ethically sourced, expertly crafted.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/en/products" className="hover:text-gold transition-colors">Pearls</Link></li>
              <li><Link href="/en/about" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link href="/en/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Contact</h4>
            <ul className="text-sm space-y-2 text-zinc-400">
              <li>hello@oceanpearl.com</li>
              <li>WhatsApp: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-700 pt-6 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>© 2024 Ocean Pearl. {t('rights')}</p>
          <div className="flex gap-4">
            <span>{t('privacy')}</span>
            <span>{t('terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
