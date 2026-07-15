import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const GET = requireAdmin(async () => {
  const orders = db.prepare(`
    SELECT o.id, o.total, o.status, o.stripe_session_id, o.created_at,
           u.name as customer_name, u.email as customer_email,
           o.shipping
    FROM orders o LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `).all();

  const header = 'OrderID,Total,Status,Customer,Email,StripeSession,Date,ShippingInfo\n';
  const rows = orders.map(o =>
    `"${o.id.slice(0, 8)}",${o.total},"${o.status}","${o.customer_name || 'Guest'}","${o.customer_email || ''}","${o.stripe_session_id || ''}","${o.created_at}","${o.shipping?.replace(/"/g, '""')}"`
  ).join('\n');

  return new Response(header + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=orders-${new Date().toISOString().slice(0, 10)}.csv`,
    },
  });
});
