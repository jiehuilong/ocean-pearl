import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const GET = requireAdmin(async (req, { params }) => {
  const { id } = await params;
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(order.user_id);
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);

  return NextResponse.json({
    order: {
      id: order.id,
      userId: order.user_id,
      total: order.total,
      status: order.status,
      shipping: JSON.parse(order.shipping || '{}'),
      stripeSessionId: order.stripe_session_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      user: user || null,
      items: items.map(i => ({
        id: i.id, productName: i.product_name, price: i.price, quantity: i.quantity,
      })),
    },
  });
});
