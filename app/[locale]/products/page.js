import ProductCard from '@/components/product-card';
import { getProducts, getCategories } from '@/lib/products';
import { Link } from '@/i18n/navigation';
import { t } from '@/lib/messages';

export default async function ProductsPage({ params, searchParams }) {
  const { locale } = await params;
  const { category } = await searchParams;
  const products = getProducts(category);
  const cats = getCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-ocean mb-8">{t(locale, 'products.title')}</h1>
      <div className="flex gap-3 mb-10 flex-wrap">
        <Link href={`/${locale}/products`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-ocean text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>{t(locale, 'products.all')}</Link>
        {cats.map(cat => (
          <Link key={cat} href={`/${locale}/products?category=${cat}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat ? 'bg-ocean text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>{t(locale, `home.${cat}`)}</Link>
        ))}
      </div>
      {products.length === 0 ? (
        <p className="text-zinc-400 text-center py-12">{t(locale, 'products.no_products')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">{products.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      )}
    </div>
  );
}
