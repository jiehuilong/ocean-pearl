'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { currencies } from '@/lib/currency';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  useEffect(() => { try { const s = localStorage.getItem('currency'); if (s) setCurrency(s); } catch {} }, []);
  const change = (code) => { setCurrency(code); localStorage.setItem('currency', code); };
  return <CurrencyContext.Provider value={{ currency, change }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() { return useContext(CurrencyContext); }

export function CurrencySwitcher() {
  const { currency, change } = useCurrency();
  return (
    <select value={currency} onChange={e => change(e.target.value)}
      className="text-sm bg-transparent border border-zinc-300 rounded px-2 py-1 focus:outline-none focus:border-gold cursor-pointer">
      {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
    </select>
  );
}
