import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const GET = requireAdmin(async () => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();

  const header = 'Slug,Name(EN),Category,Price,CompareAt,Stock,Images\n';
  const rows = products.map(p => {
    const name = JSON.parse(p.name || '{}');
    return `"${p.slug}","${(name.en || '').replace(/"/g, '""')}","${p.category}",${p.price},${p.compare_at || ''},${p.stock},"${(p.images || '').replace(/"/g, '""')}"`;
  }).join('\n');

  return new Response(header + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=products-${new Date().toISOString().slice(0, 10)}.csv`,
    },
  });
});
