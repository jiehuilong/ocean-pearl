import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/add-to-cart-button';
import ProductCard from '@/components/product-card';
import ProductReviews from '@/components/product-reviews';
import { getProduct, getRelatedProducts } from '@/lib/products';
import { t } from '@/lib/messages';

export default async function ProductDetailPage({ params }) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const name = product.name[locale] || product.name.en;
  const desc = product.description[locale] || product.description.en;
  const specs = product.specs[locale] || product.specs.en;
  const related = getRelatedProducts(slug, product.category);
  const imageUrl = product.images?.[0] ? `https://oceanpearl.com/images/${product.images[0]}` : 'https://oceanpearl.com/og-image.jpg';

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    description: desc.slice(0, 200),
    image: imageUrl,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://oceanpearl.com/${locale}/products/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="aspect-square bg-gradient-to-br from-pearl to-pearl-dark rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-zinc-300"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-light text-ocean mb-2">{name}</h1>
            <p className="text-2xl font-semibold text-gold mb-6">${product.price.toLocaleString()}{product.compareAt && <span className="text-zinc-400 line-through text-lg ml-3">${product.compareAt.toLocaleString()}</span>}</p>
            <p className="text-zinc-600 leading-relaxed mb-8">{desc}</p>
            <AddToCartButton product={{ slug: product.slug, name, price: product.price, images: product.images }} />
            <div className="mt-10 border-t border-zinc-200 pt-6">
              <h3 className="font-medium text-ocean mb-3">{t(locale, 'products.specs')}</h3>
              <dl className="space-y-2">{Object.entries(specs).map(([key, val]) => <div key={key} className="flex text-sm"><dt className="w-28 text-zinc-400">{key}</dt><dd className="text-zinc-700">{val}</dd></div>)}</dl>
            </div>
          </div>
        </div>
        {related.length > 0 && <div><h2 className="text-xl font-light text-ocean mb-6">{t(locale, 'products.related')}</h2><div className="grid grid-cols-1 sm:grid-cols-3 gap-6">{related.map(p => <ProductCard key={p.slug} product={p} />)}</div></div>}
        <ProductReviews productSlug={slug} />
      </div>
    </>
  );
}
