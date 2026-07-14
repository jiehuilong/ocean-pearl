import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-middleware';
import { db, uid } from '@/lib/db';

export const GET = requireUser(async (req) => {
  const items = db.prepare(`
    SELECT ci.*, p.slug, p.name, p.price, p.images, p.stock
    FROM cart_items ci JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `).all(req.user.id);
  return NextResponse.json({ items });
});

export const POST = requireUser(async (req) => {
  const { productId, quantity = 1 } = await req.json();

  const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);
  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?').run(quantity, req.user.id, productId);
    return NextResponse.json({ ok: true });
  }

  db.prepare('INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)').run(uid(), req.user.id, productId, quantity);
  return NextResponse.json({ ok: true }, { status: 201 });
});
