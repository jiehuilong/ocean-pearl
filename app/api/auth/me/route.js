import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';

export async function GET(req) {
  const user = await authenticate(req);
  return NextResponse.json({ user });
}
