import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const locale = url.searchParams.get('locale') || 'en';

  if (!q || q.length < 1) return NextResponse.json({ products: [] });

  const products = db.prepare(`
    SELECT * FROM products
    WHERE slug LIKE ? OR name LIKE ? OR category LIKE ?
    ORDER BY price ASC
    LIMIT 20
  `).all(`%${q}%`, `%${q}%`, `%${q}%`);

  return NextResponse.json({
    products: products.map(p => ({
      id: p.id,
      slug: p.slug,
      name: JSON.parse(p.name || '{}'),
      price: p.price,
      category: p.category,
      stock: p.stock,
    })),
    query: q,
  });
}
