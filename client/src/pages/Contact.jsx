import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-slate-900">Contact</h1>
      <p className="mt-4 text-slate-600">Questions or feedback about SmartHealth? We'd love to hear from you.</p>
      <a
        href="mailto:support@smarthealth.example"
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-700 shadow-sm transition hover:border-brand-300 hover:shadow-md"
      >
        <Mail className="h-4 w-4" /> support@smarthealth.example
      </a>
    </div>
  );
}
