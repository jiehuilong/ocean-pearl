import Link from 'next/link';
import ProductCard from '@/components/product-card';
import { getProducts } from '@/lib/products';
import { t } from '@/lib/messages';

export default async function HomePage({ params }) {
  const { locale } = await params;

  const featured = getProducts().slice(0, 3);
  const categories = ['akoya', 'freshwater', 'southsea'];

  return (
    <div>
      <section className="bg-gradient-to-b from-pearl to-white py-24 md:py-36 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-wide text-ocean mb-6">{t(locale, 'hero.title')}</h1>
          <p className="text-zinc-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">{t(locale, 'hero.subtitle')}</p>
          <Link href={`/${locale}/products`} className="inline-block bg-ocean text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-ocean-light transition-colors">{t(locale, 'hero.cta')}</Link>
        </div>
      </section>
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light text-center text-ocean mb-12">{t(locale, 'home.featured')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">{featured.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      </section>
      <section className="bg-pearl py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center text-ocean mb-12">{t(locale, 'home.categories')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(cat => (
              <Link key={cat} href={`/${locale}/products?category=${cat}`} className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3 className="font-semibold text-lg text-ocean mb-2">{t(locale, `home.${cat}`)}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{t(locale, `home.${cat}_desc`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-light text-ocean mb-6">{t(locale, 'home.story_title')}</h2>
        <p className="text-zinc-500 leading-relaxed">{t(locale, 'home.story_text')}</p>
      </section>
    </div>
  );
}
