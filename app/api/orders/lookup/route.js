import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get('orderId');
  const email = url.searchParams.get('email');

  if (!orderId || !email) {
    return NextResponse.json({ error: 'orderId and email required' }, { status: 400 });
  }

  const order = db.prepare("SELECT * FROM orders WHERE id LIKE ? AND shipping LIKE ?").get(`%${orderId}%`, `%${email}%`);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(order.user_id);
  const shipping = JSON.parse(order.shipping || '{}');

  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      customerName: user?.name || shipping.name || 'Guest',
      shipping,
      items: items.map(i => ({ productName: i.product_name, price: i.price, quantity: i.quantity })),
    },
  });
}
