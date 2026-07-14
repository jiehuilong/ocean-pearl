import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';
import { resetTokens } from '@/app/api/auth/forgot-password/route';

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: 'Password too short' }, { status: 400 });

    const entry = resetTokens.get(token);
    if (!entry || Date.now() > entry.expiresAt) {
      resetTokens.delete(token);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, entry.userId);
    resetTokens.delete(token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
