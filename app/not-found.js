import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-light text-ocean mb-4">404</h1>
      <p className="text-zinc-500 mb-8">Page not found</p>
      <Link href="/en" className="inline-block bg-ocean text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-ocean-light transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
