import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartPulse, LogOut, Menu, X, Stethoscope, Users2, Info, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GetStartedMenu from './GetStartedMenu';
import ThemeToggle from './ThemeToggle';

const DASHBOARD_PATH = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' };

const NAV_LINKS = [
  { to: '/#symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { to: '/#specialties', label: 'Specialties', icon: Users2 },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md shadow-brand-500/30">
            <HeartPulse className="h-4.5 w-4.5" />
          </span>
          SmartHealth
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 text-sm lg:flex">
          <ThemeToggle />
          {role ? (
            <>
              <Link
                to={DASHBOARD_PATH[role]}
                className="font-medium text-slate-700 hover:text-brand-700 dark:text-slate-200 dark:hover:text-brand-400"
              >
                {user?.name || 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            <GetStartedMenu />
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="space-y-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" /> {label}
                </Link>
              ))}

              <div className="mt-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                {role ? (
                  <div className="space-y-1">
                    <Link
                      to={DASHBOARD_PATH[role]}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/30"
                    >
                      {user?.name || 'Dashboard'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 px-1">
                    <Link
                      to="/patient/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                    >
                      Patient login
                    </Link>
                    <Link
                      to="/doctor/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-3 py-2 text-center text-sm font-medium text-white"
                    >
                      Doctor login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
