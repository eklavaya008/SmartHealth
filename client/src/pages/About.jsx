import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CalendarClock, Stethoscope, Target, Eye, ArrowRight, UserCheck2, ClipboardCheck, Ban } from 'lucide-react';
import Button from '../components/ui/Button';

const VALUES = [
  { icon: Stethoscope, title: 'Transparent matching', text: 'A rule-based keyword engine — no black-box ML, no false certainty — suggests a specialty from your symptoms, with the matched keywords shown alongside it.' },
  { icon: ShieldCheck, title: 'Verified doctors', text: 'Every new doctor account is reviewed by an admin before it goes live, so you only ever book with verified, credentialed practitioners.' },
  { icon: CalendarClock, title: 'Real availability', text: 'Doctors set their own weekly hours; you book from slots that are actually open, with no double-booking and no back-and-forth.' },
];

const VETTING_STEPS = [
  { icon: ClipboardCheck, title: 'Application', text: 'Doctors submit credentials, specialty, and license number during signup.' },
  { icon: UserCheck2, title: 'Admin review', text: 'An administrator reviews every application before it can appear publicly.' },
  { icon: Ban, title: 'Reject or deactivate', text: 'Applications can be rejected with a reason, and live profiles can be deactivated at any time.' },
];

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-14 pt-16 sm:px-6 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white dark:from-brand-950/30 dark:via-slate-950 dark:to-slate-950" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            About SmartHealth
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Care coordination, built to be trusted
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            SmartHealth helps patients describe symptoms in plain language, get matched to the right specialty, and
            book a real appointment slot — while giving doctors a verified, no-hassle way to manage their practice.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              <Target className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-slate-800 dark:text-slate-100">Our mission</h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Cut the time between "something feels wrong" and "I have an appointment with the right person" — without
              compromising on who that person is.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">
              <Eye className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-slate-800 dark:text-slate-100">Our approach</h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Every automated suggestion is explainable — you see exactly which words matched and how confident the
              system is, not a black box.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 dark:bg-slate-900/40">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">What we stand on</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700 dark:from-brand-900/40 dark:to-accent-900/40 dark:text-brand-300">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">How we vet every doctor</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">No self-registered profile goes public without review.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {VETTING_STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 font-display text-xs font-bold text-white dark:bg-brand-500">
                {i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                <Icon className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-display text-2xl font-bold">Ready to get started?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/85">
            Book your first appointment in minutes, or register as a doctor and start managing patients today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/patient/signup">
              <Button
                variant="outline"
                className="border-white/30 bg-white text-brand-700 hover:bg-white/90 dark:border-white/30 dark:bg-white dark:text-brand-700 dark:hover:bg-white/90"
              >
                Find a doctor <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/doctor/signup">
              <Button variant="ghost" className="text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/10">
                Register as a doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
