import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Stethoscope, ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const GROUPS = [
  {
    key: 'patient',
    icon: User,
    title: "I'm a patient",
    text: 'Book appointments & manage your visits',
    login: '/patient/login',
    signup: '/patient/signup',
  },
  {
    key: 'doctor',
    icon: Stethoscope,
    title: "I'm a doctor",
    text: 'Manage availability & appointments',
    login: '/doctor/login',
    signup: '/doctor/signup',
  },
];

export default function GetStartedMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button onClick={() => setOpen((o) => !o)} className="px-4 py-2 text-xs sm:text-sm">
        Get Started
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-[21rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40"
          >
            {GROUPS.map(({ key, icon: Icon, title, text, login, signup }) => (
              <div key={key} className="flex items-center gap-3 border-b border-slate-100 p-4 last:border-b-0 dark:border-slate-800">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700 dark:from-brand-900/40 dark:to-accent-900/40 dark:text-brand-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{text}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                  <Link
                    to={login}
                    onClick={() => setOpen(false)}
                    className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    Log in
                  </Link>
                  <Link
                    to={signup}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-0.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Sign up <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
