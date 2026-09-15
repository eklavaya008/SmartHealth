import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-white">
        Back home
      </Link>
    </div>
  );
}
