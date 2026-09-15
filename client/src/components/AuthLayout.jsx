import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, CalendarClock, Stethoscope } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, text: 'Every doctor is admin-verified before going live' },
  { icon: CalendarClock, text: 'Real-time slots — no double-booking, ever' },
  { icon: Stethoscope, text: 'Symptom-matched specialties in seconds' },
];

export default function AuthLayout({ title, subtitle, tagline, children, wide = false }) {
  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-2 font-display text-lg font-bold"
        >
          <HeartPulse className="h-6 w-6" />
          SmartHealth
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10"
        >
          <h2 className="font-display text-3xl font-bold leading-tight lg:text-4xl">{tagline}</h2>
          <div className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="text-sm text-white/90">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative z-10 text-xs text-white/60">&copy; {new Date().getFullYear()} SmartHealth</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`w-full ${wide ? 'max-w-xl' : 'max-w-md'}`}
        >
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
