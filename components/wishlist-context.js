'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try { const saved = localStorage.getItem('wishlist'); if (saved) setItems(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(items)); }, [items]);

  const toggle = useCallback((slug) => {
    setItems(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  }, []);

  const has = useCallback((slug) => items.includes(slug), [items]);

  return <WishlistContext.Provider value={{ items, toggle, has }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() { return useContext(WishlistContext); }
