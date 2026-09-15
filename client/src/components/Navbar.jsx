import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DASHBOARD_PATH = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' };

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-700">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-500" />
          SmartHealth
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/about" className="hidden text-slate-600 hover:text-brand-700 sm:inline">
            About
          </Link>
          <Link to="/contact" className="hidden text-slate-600 hover:text-brand-700 sm:inline">
            Contact
          </Link>

          {role ? (
            <>
              <Link to={DASHBOARD_PATH[role]} className="font-medium text-brand-700 hover:text-brand-800">
                {user?.name || 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/patient/login" className="text-slate-600 hover:text-brand-700">
                Patient Login
              </Link>
              <Link
                to="/doctor/login"
                className="rounded-md bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700"
              >
                Doctor Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
