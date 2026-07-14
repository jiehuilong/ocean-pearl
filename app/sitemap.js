// Next.js built-in sitemap format — returns array of URL entries
// Each entry: { url, lastModified, changeFrequency, priority, alternates }
import productsData from '@/data/products.json';

const locales = ['en', 'zh', 'ja', 'fr'];
const BASE = 'https://oceanpearl.com';

const staticPages = ['', '/products', '/about', '/contact', '/privacy', '/terms'];

export default async function sitemap() {
  const entries = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE}/${locale}${page}`,
        lastModified: new Date('2026-07-14'),
        changeFrequency: 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(locales.map(l => [l, `${BASE}/${l}${page}`])),
        },
      });
    }
  }

  for (const product of productsData) {
    entries.push({
      url: `${BASE}/en/products/${product.slug}`,
      lastModified: new Date('2026-07-14'),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  return entries;
}
