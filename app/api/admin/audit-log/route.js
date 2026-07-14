import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/db';
import { uid } from '@/lib/db';

export const GET = requireAdmin(async () => {
  const logs = db.prepare(`
    SELECT al.*, u.name as user_name
    FROM audit_log al LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC LIMIT 100
  `).all();
  return NextResponse.json({ logs });
});

// Helper to write audit log from any API route
export function writeAuditLog(userId, action, details = {}) {
  db.prepare('INSERT INTO audit_log (id, user_id, action, details) VALUES (?, ?, ?, ?)').run(uid(), userId, action, JSON.stringify(details));
}
