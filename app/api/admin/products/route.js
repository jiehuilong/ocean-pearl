import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db, uid } from '@/lib/db';

export const GET = requireAdmin(async (req) => {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || '';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params = [];
  if (search) { where += ' AND (name LIKE ? OR slug LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM products ${where}`).get(...params).count;
  const products = db.prepare(`SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);

  return NextResponse.json({ products, total, page });
});

export const POST = requireAdmin(async (req) => {
  const data = await req.json();
  const id = uid();
  db.prepare(`INSERT INTO products (id, slug, name, description, specs, price, compare_at, images, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, data.slug, JSON.stringify(data.name), JSON.stringify(data.description), JSON.stringify(data.specs || {}),
      parseFloat(data.price), data.compareAt ? parseFloat(data.compareAt) : null,
      JSON.stringify(data.images || []), data.category, parseInt(data.stock) || 99);
  return NextResponse.json({ id }, { status: 201 });
});
