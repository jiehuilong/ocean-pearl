import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req) {
  const url = new URL(req.url);
  const productSlug = url.searchParams.get('product');
  if (!productSlug) return NextResponse.json({ reviews: [] });

  const reviews = db.prepare("SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_slug = ? ORDER BY r.created_at DESC").all(productSlug);
  const stats = db.prepare("SELECT COUNT(*) as count, AVG(rating) as avg FROM reviews WHERE product_slug = ?").get(productSlug);

  return NextResponse.json({ reviews, stats: { count: stats.count, avg: stats.avg ? Math.round(stats.avg * 10) / 10 : 0 } });
}

export async function POST(req) {
  const { productSlug, rating, comment, userName } = await req.json();
  if (!productSlug || !rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  if (rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });

  const { uid } = await import('@/lib/db');
  db.prepare('INSERT INTO reviews (id, product_slug, rating, comment, user_name) VALUES (?, ?, ?, ?, ?)').run(uid(), productSlug, rating, comment || '', userName || 'Anonymous');

  return NextResponse.json({ ok: true }, { status: 201 });
}
