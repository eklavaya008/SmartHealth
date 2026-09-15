import { Link } from 'react-router-dom';
import { HeartPulse, Mail, ShieldCheck } from 'lucide-react';
import { SPECIALTIES } from '../constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <HeartPulse className="h-4.5 w-4.5" />
              </span>
              SmartHealth
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Symptom-matched specialties and real-time appointment booking with admin-verified doctors.
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Every doctor is reviewed before going live
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-slate-800">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/#symptom-checker" className="hover:text-brand-700">Symptom Checker</Link></li>
              <li><Link to="/#specialties" className="hover:text-brand-700">Specialties</Link></li>
              <li><Link to="/about" className="hover:text-brand-700">About</Link></li>
              <li><Link to="/contact" className="hover:text-brand-700">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-slate-800">Get started</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link to="/patient/signup" className="hover:text-brand-700">Patient sign up</Link></li>
              <li><Link to="/patient/login" className="hover:text-brand-700">Patient login</Link></li>
              <li><Link to="/doctor/signup" className="hover:text-brand-700">Register as a doctor</Link></li>
              <li><Link to="/doctor/login" className="hover:text-brand-700">Doctor login</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-slate-800">Specialties</p>
            <ul className="mt-3 grid grid-cols-1 gap-y-2 text-sm text-slate-500">
              {SPECIALTIES.slice(0, 4).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SmartHealth. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> support@smarthealth.example
          </p>
        </div>
      </div>
    </footer>
  );
}
