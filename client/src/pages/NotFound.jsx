import { Link } from 'react-router-dom';
import { CompassIcon } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <CompassIcon className="h-10 w-10 text-slate-300" />
      <h1 className="mt-4 font-display text-4xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link to="/" className="mt-6">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
