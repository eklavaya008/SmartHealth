import { Link } from 'react-router-dom';
import { HeartPulse, Mail, ShieldCheck } from 'lucide-react';
import { SPECIALTIES } from '../constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <HeartPulse className="h-4.5 w-4.5" />
              </span>
              SmartHealth
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Symptom-matched specialties and real-time appointment booking with admin-verified doctors.
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" /> Every doctor is reviewed before going live
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-slate-800 dark:text-slate-100">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/#symptom-checker" className="hover:text-brand-700 dark:hover:text-brand-400">Symptom Checker</Link></li>
              <li><Link to="/#specialties" className="hover:text-brand-700 dark:hover:text-brand-400">Specialties</Link></li>
              <li><Link to="/about" className="hover:text-brand-700 dark:hover:text-brand-400">About</Link></li>
              <li><Link to="/contact" className="hover:text-brand-700 dark:hover:text-brand-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-slate-800 dark:text-slate-100">Get started</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/patient/signup" className="hover:text-brand-700 dark:hover:text-brand-400">Patient sign up</Link></li>
              <li><Link to="/patient/login" className="hover:text-brand-700 dark:hover:text-brand-400">Patient login</Link></li>
              <li><Link to="/doctor/signup" className="hover:text-brand-700 dark:hover:text-brand-400">Register as a doctor</Link></li>
              <li><Link to="/doctor/login" className="hover:text-brand-700 dark:hover:text-brand-400">Doctor login</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-slate-800 dark:text-slate-100">Specialties</p>
            <ul className="mt-3 grid grid-cols-1 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              {SPECIALTIES.slice(0, 4).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row dark:border-slate-800 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} SmartHealth. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> support@smarthealth.example
          </p>
        </div>
      </div>
    </footer>
  );
}
