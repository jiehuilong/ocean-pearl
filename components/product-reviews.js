'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function ProductReviews({ productSlug }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ count: 0, avg: 0 });
  const [form, setForm] = useState({ rating: 5, comment: '', userName: '' });
  const [submitted, setSubmitted] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    fetch(`/api/reviews?product=${productSlug}`).then(r => r.json()).then(d => {
      if (d.reviews) setReviews(d.reviews);
      if (d.stats) setStats(d.stats);
    }).catch(() => {});
  }, [productSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, productSlug }),
    });
    setSubmitted(true);
    setForm({ rating: 5, comment: '', userName: '' });
    // Refresh
    const res = await fetch(`/api/reviews?product=${productSlug}`);
    const d = await res.json();
    if (d.reviews) setReviews(d.reviews);
    if (d.stats) setStats(d.stats);
  };

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="mt-16 border-t border-zinc-200 pt-10">
      <h2 className="text-xl font-light text-ocean mb-2">Customer Reviews</h2>
      {stats.count > 0 && (
        <p className="text-sm text-zinc-500 mb-6">
          <span className="text-gold font-medium">{stats.avg.toFixed(1)}</span> out of 5 ({stats.count} reviews)
        </p>
      )}

      <div className="space-y-4 mb-10">
        {reviews.length === 0 && <p className="text-sm text-zinc-400">No reviews yet. Be the first!</p>}
        {reviews.map(r => (
          <div key={r.id} className="border border-zinc-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gold text-sm">{stars(r.rating)}</span>
              <span className="text-xs text-zinc-400">{r.user_name} · {new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            {r.comment && <p className="text-sm text-zinc-600">{r.comment}</p>}
          </div>
        ))}
      </div>

      {submitted ? (
        <p className="text-green-600 text-sm">Thank you for your review!</p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md space-y-3">
          <h3 className="font-medium text-sm text-ocean">Write a Review</h3>
          <div className="flex gap-1">
            {[5,4,3,2,1].map(n => (
              <button key={n} type="button" onClick={() => setForm(f => ({...f, rating: n}))}
                className={`text-xl ${form.rating >= n ? 'text-gold' : 'text-zinc-300'} hover:text-gold transition-colors`}>{'★'}</button>
            ))}
          </div>
          <input type="text" placeholder="Your name (optional)" value={form.userName} onChange={e => setForm(f => ({...f, userName: e.target.value}))}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          <textarea placeholder="Share your experience..." rows={3} value={form.comment} onChange={e => setForm(f => ({...f, comment: e.target.value}))}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none" />
          <button type="submit" className="bg-ocean text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-ocean-light transition-colors">Submit Review</button>
        </form>
      )}
    </div>
  );
}
