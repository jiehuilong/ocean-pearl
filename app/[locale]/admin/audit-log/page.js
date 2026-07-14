'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth-context';

export default function AdminAuditLogPage() {
  const t = useTranslations('admin');
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-log').then(r => r.json()).then(d => {
      if (d.logs) setLogs(d.logs);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (authLoading || loading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-24"><p className="text-zinc-500">{t('access_denied')}</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-light text-ocean mb-6">Audit Log</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-zinc-200 text-left text-zinc-400">
            <th className="pb-3 pr-4">Time</th><th className="pb-3 pr-4">User</th><th className="pb-3 pr-4">Action</th><th className="pb-3">Details</th>
          </tr></thead>
          <tbody>
            {logs.map(log => {
              let details = '';
              try { const d = JSON.parse(log.details); details = d.orderId ? `Order: ${d.orderId.slice(0, 8)}` : log.details; } catch { details = log.details; }
              return (
                <tr key={log.id} className="border-b border-zinc-100">
                  <td className="py-2 text-zinc-500">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="py-2">{log.user_name || log.user_id?.slice(0, 8)}</td>
                  <td className="py-2"><code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">{log.action}</code></td>
                  <td className="py-2 text-xs text-zinc-500">{details}</td>
                </tr>
              );
            })}
            {logs.length === 0 && <tr><td colSpan="4" className="py-8 text-center text-zinc-400">No audit log entries.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
