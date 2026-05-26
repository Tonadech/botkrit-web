import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy text-white p-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-brand-gold">404</h1>
        <p className="mt-4 text-lg">Page not found</p>
        <Link href="/" className="mt-6 inline-block btn-gold">
          Go home
        </Link>
      </div>
    </div>
  );
}
