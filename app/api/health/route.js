import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    db.prepare('SELECT 1').get();
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
    });
  } catch (err) {
    return NextResponse.json({ status: 'unhealthy', database: 'disconnected', error: err.message }, { status: 500 });
  }
}
