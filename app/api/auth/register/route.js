import { NextResponse } from 'next/server';
import { db, uid } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const id = uid();
    db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(id, email, hashed, name, 'CUSTOMER');

    const token = await signToken({ userId: id, role: 'CUSTOMER' });
    const res = NextResponse.json({ user: { id, name, email, role: 'CUSTOMER' } });
    res.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 604800 });
    return res;
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
