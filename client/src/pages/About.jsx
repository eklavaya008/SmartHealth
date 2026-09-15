import { ShieldCheck, CalendarClock, Stethoscope } from 'lucide-react';

const POINTS = [
  { icon: Stethoscope, title: 'Transparent matching', text: 'A rule-based keyword engine — no black-box ML, no false certainty — suggests a specialty from your symptoms.' },
  { icon: ShieldCheck, title: 'Verified doctors', text: 'Every new doctor account is reviewed by an admin before it goes live, so you only ever book with verified practitioners.' },
  { icon: CalendarClock, title: 'Real availability', text: 'Doctors set their own weekly hours; you book from slots that are actually open, with no double-booking.' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-slate-900">About SmartHealth</h1>
      <p className="mt-4 text-slate-600">
        SmartHealth helps patients describe their symptoms in plain language and get matched to the right medical
        specialty, then book a real appointment slot and manage everything from a dashboard.
      </p>

      <div className="mt-10 space-y-6">
        {POINTS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-800">{title}</h2>
              <p className="mt-0.5 text-sm text-slate-600">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
