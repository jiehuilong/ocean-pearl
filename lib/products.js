import productsData from '@/data/products.json';

export function getProducts(category) {
  if (!category || category === 'all') return productsData;
  return productsData.filter(p => p.category === category);
}

export function getProduct(slug) {
  return productsData.find(p => p.slug === slug) || null;
}

export function getCategories() {
  const cats = [...new Set(productsData.map(p => p.category))];
  return cats;
}

export function getRelatedProducts(currentSlug, category, limit = 3) {
  return productsData
    .filter(p => p.category === category && p.slug !== currentSlug)
    .slice(0, limit);
}
