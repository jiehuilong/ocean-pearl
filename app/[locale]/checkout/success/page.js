import Link from 'next/link';
import { t } from '@/lib/messages';

export default async function CheckoutSuccessPage({ params }) {
  const { locale } = await params;

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1 className="text-3xl font-light text-ocean mb-4">{t(locale, 'checkout.success_title')}</h1>
      <p className="text-zinc-500 mb-8">{t(locale, 'checkout.success_message')}</p>
      <Link href={`/${locale}/products`} className="inline-block bg-ocean text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-ocean-light transition-colors">Continue Shopping</Link>
    </div>
  );
}
