import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const GET = requireAdmin(async (req) => {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params = [];
  if (search) { where += ' AND (o.id LIKE ? OR u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (status) { where += ' AND o.status = ?'; params.push(status); }

  const countRow = db.prepare(`SELECT COUNT(*) as count FROM orders o LEFT JOIN users u ON o.user_id = u.id ${where}`).get(...params);
  const total = countRow.count;

  const rows = db.prepare(`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o LEFT JOIN users u ON o.user_id = u.id ${where}
    ORDER BY o.created_at DESC LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const orders = rows.map(o => ({
    id: o.id, userId: o.user_id, total: o.total, status: o.status,
    shipping: o.shipping, stripeSessionId: o.stripe_session_id,
    createdAt: o.created_at, updatedAt: o.updated_at,
    user: o.user_name ? { name: o.user_name, email: o.user_email } : null,
    items: db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id).map(i => ({
      id: i.id, orderId: i.order_id, productId: i.product_id,
      productName: i.product_name, price: i.price, quantity: i.quantity,
    })),
  }));

  return NextResponse.json({ orders, total, page });
});
