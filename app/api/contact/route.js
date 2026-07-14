import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // ponytail: log to console — add email service (Resend/SendGrid) when volume justifies it
    console.log('[CONTACT]', { name, email, message, timestamp: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
