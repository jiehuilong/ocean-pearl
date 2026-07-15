'use client';

import { useWishlist } from './wishlist-context';

export default function WishlistButton({ slug }) {
  const { toggle, has } = useWishlist();
  const active = has(slug);
  return (
    <button onClick={() => toggle(slug)} className={`transition-colors ${active ? 'text-gold' : 'text-zinc-300 hover:text-gold'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}
