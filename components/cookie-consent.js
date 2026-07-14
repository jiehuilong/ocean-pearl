'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem('cookie-consent');
    if (!consented) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ocean text-white p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-300">
          We use essential cookies for authentication and cart functionality.
          By continuing, you accept our use of cookies.
        </p>
        <button onClick={accept} className="bg-gold text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gold-light transition-colors whitespace-nowrap">
          Accept
        </button>
      </div>
    </div>
  );
}
