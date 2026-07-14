import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const PUT = requireUser(async (req, { params }) => {
  const { productId } = await params;
  const { quantity } = await req.json();
  db.prepare('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?').run(quantity, req.user.id, productId);
  return NextResponse.json({ ok: true });
});

export const DELETE = requireUser(async (req, { params }) => {
  const { productId } = await params;
  db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);
  return NextResponse.json({ ok: true });
});
