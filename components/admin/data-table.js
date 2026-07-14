'use client';

import { useState, useCallback } from 'react';

export default function DataTable({ columns, data, loading, emptyText, onSearch, page, total, limit = 20 }) {
  const [search, setSearch] = useState('');
  const timeoutRef = useState(null);

  const handleSearch = useCallback((val) => {
    setSearch(val);
    clearTimeout(timeoutRef[0]);
    const t = setTimeout(() => onSearch?.(val), 300);
    timeoutRef[1](t);
  }, [onSearch]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {onSearch && (
        <input
          type="text"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search..."
          className="w-full sm:w-72 border border-zinc-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gold"
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-zinc-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">{emptyText || 'No data found.'}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-400">
                {columns.map(col => <th key={col.key} className="pb-3 pr-4 font-medium whitespace-nowrap">{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id || i} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="py-3 pr-4">{col.render ? col.render(row) : row[col.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-zinc-500">
          <span>Page {page || 1} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => onSearch?.(search, (page || 1) - 1)}
              className="px-3 py-1 border border-zinc-300 rounded hover:bg-zinc-50 disabled:opacity-30">Prev</button>
            <button disabled={page >= totalPages} onClick={() => onSearch?.(search, (page || 1) + 1)}
              className="px-3 py-1 border border-zinc-300 rounded hover:bg-zinc-50 disabled:opacity-30">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
