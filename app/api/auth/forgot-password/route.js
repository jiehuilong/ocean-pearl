import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { authLimiter } from '@/lib/rate-limit';
import { sendEmail, passwordResetEmail } from '@/lib/email';

// In-memory reset tokens — use DB table in production
const resetTokens = new Map();

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = authLimiter(ip);
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const user = db.prepare('SELECT id, name FROM users WHERE email = ?').get(email);
    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ ok: true });

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.set(token, { userId: user.id, email, expiresAt: Date.now() + 3600000 });

    const emailData = passwordResetEmail({ token, email });
    await sendEmail({ to: email, ...emailData });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export { resetTokens };
