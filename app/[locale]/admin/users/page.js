'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import DataTable from '@/components/admin/data-table';
import StatusBadge from '@/components/admin/status-badge';

export default function AdminUsersPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const { user: authUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = useCallback(async (q, p) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search: q || '', role: roleFilter, page: p || 1 });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch {} finally { setLoading(false); }
  }, [roleFilter]);

  useEffect(() => { fetchUsers(search, 1); }, [fetchUsers]);

  const columns = [
    { key: 'name', label: 'Name', render: (u) => <span className="font-medium text-ocean">{u.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'role', label: t('role'), render: (u) => <StatusBadge status={u.role} /> },
    { key: 'created_at', label: t('joined'), render: (u) => new Date(u.created_at).toLocaleDateString() },
    { key: 'actions', label: '', render: (u) => (
      <Link href={`/${locale}/admin/users/${u.id}`} className="text-gold hover:underline text-xs">{t('users')}</Link>
    )},
  ];

  if (authLoading) return <div className="text-center py-24 text-zinc-400">Loading...</div>;
  if (!authUser || authUser.role !== 'ADMIN') return <div className="text-center py-24"><p className="text-zinc-500">{t('access_denied')}</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-light text-ocean mb-6">{t('users')}</h1>
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder={t('search_user')} value={search}
          onChange={e => { setSearch(e.target.value); fetchUsers(e.target.value, 1); }}
          className="flex-1 sm:flex-none sm:w-72 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold">
          <option value="">{t('all_roles')}</option>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <DataTable columns={columns} data={users} loading={loading} emptyText={t('no_users')}
        total={total} page={page} limit={20} onSearch={(q, p) => fetchUsers(q || search, p)} />
    </div>
  );
}
