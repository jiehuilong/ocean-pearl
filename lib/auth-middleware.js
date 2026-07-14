import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function authenticate(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(payload.userId);
  return user || null;
}

export function requireUser(handler) {
  return async (req, ...args) => {
    const user = await authenticate(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    req.user = user;
    return handler(req, ...args);
  };
}

export function requireAdmin(handler) {
  return async (req, ...args) => {
    const user = await authenticate(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    req.user = user;
    return handler(req, ...args);
  };
}
