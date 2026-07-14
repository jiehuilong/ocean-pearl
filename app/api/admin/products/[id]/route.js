import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const GET = requireAdmin(async (req, { params }) => {
  const { id } = await params;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
});

export const PUT = requireAdmin(async (req, { params }) => {
  const { id } = await params;
  const data = await req.json();

  const sets = [];
  const vals = [];
  const colMap = { price: 'price', compareAt: 'compare_at', stock: 'stock', slug: 'slug', category: 'category' };
  for (const [key, val] of Object.entries(data)) {
    const col = colMap[key];
    if (col) { sets.push(`${col} = ?`); vals.push(val); }
  }
  if (data.name) { sets.push('name = ?'); vals.push(JSON.stringify(data.name)); }
  if (data.desc) { sets.push('description = ?'); vals.push(JSON.stringify(data.desc)); }
  if (data.images) { sets.push('images = ?'); vals.push(JSON.stringify(data.images)); }
  if (data.specs) { sets.push('specs = ?'); vals.push(JSON.stringify(data.specs)); }

  if (sets.length === 0) return NextResponse.json({ error: 'No fields' }, { status: 400 });
  sets.push("updated_at = datetime('now')");
  vals.push(id);
  db.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
  return NextResponse.json({ ok: true });
});

export const DELETE = requireAdmin(async (req, { params }) => {
  const { id } = await params;
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
});
