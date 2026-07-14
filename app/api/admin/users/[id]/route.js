import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const GET = requireAdmin(async (req, { params }) => {
  const { id } = await params;
  const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const orders = db.prepare('SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(id);
  return NextResponse.json({ user, orders });
});

export const PUT = requireAdmin(async (req, { params }) => {
  const { id } = await params;
  const { role } = await req.json();
  if (!['CUSTOMER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
  return NextResponse.json({ ok: true });
});
