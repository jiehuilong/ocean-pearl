import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const GET = requireUser(async (req) => {
  const rows = db.prepare(`
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.user.id);

  const orders = rows.map(o => ({
    id: o.id,
    userId: o.user_id,
    total: o.total,
    status: o.status,
    shipping: o.shipping,
    stripeSessionId: o.stripe_session_id,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    items: db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id).map(i => ({
      id: i.id,
      orderId: i.order_id,
      productId: i.product_id,
      productName: i.product_name,
      price: i.price,
      quantity: i.quantity,
    })),
  }));

  return NextResponse.json({ orders });
});
