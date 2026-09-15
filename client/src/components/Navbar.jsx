import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const DASHBOARD_PATH = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' };

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md shadow-brand-500/30">
            <HeartPulse className="h-4.5 w-4.5" />
          </span>
          SmartHealth
        </Link>

        <div className="flex items-center gap-3 text-sm sm:gap-5">
          <Link to="/about" className="hidden text-slate-600 transition hover:text-brand-700 sm:inline">
            About
          </Link>
          <Link to="/contact" className="hidden text-slate-600 transition hover:text-brand-700 sm:inline">
            Contact
          </Link>

          {role ? (
            <>
              <Link
                to={DASHBOARD_PATH[role]}
                className="hidden font-medium text-slate-700 hover:text-brand-700 sm:inline"
              >
                {user?.name || 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/patient/login" className="text-slate-600 transition hover:text-brand-700">
                Patient Login
              </Link>
              <Link to="/doctor/login">
                <Button className="px-4 py-2 text-xs sm:text-sm">Doctor Login</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
