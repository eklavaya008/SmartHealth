import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock, MessageCircle, Send } from 'lucide-react';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

const SUPPORT_EMAIL = 'support@smarthealth.example';

const INFO_CARDS = [
  { icon: Mail, title: 'Email us', text: SUPPORT_EMAIL },
  { icon: Clock, title: 'Response time', text: 'Within 1 business day' },
  { icon: MessageCircle, title: 'Support hours', text: 'Mon–Fri, 9am–6pm' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name || 'a SmartHealth visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-14 pt-16 sm:px-6 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            Get in touch
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">We'd love to hear from you</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Questions about booking, becoming a partner doctor, or feedback on the platform — reach out anytime.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            {INFO_CARDS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-slate-800">{title}</p>
                  <p className="text-sm text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField required placeholder="Your name" value={form.name} onChange={set('name')} />
              <TextField type="email" required placeholder="Your email" value={form.email} onChange={set('email')} />
            </div>
            <TextField as="textarea" required rows={5} placeholder="How can we help?" value={form.message} onChange={set('message')} />
            <Button type="submit" className="w-full">
              Send message <Send className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-slate-400">Opens your email client with this message pre-filled.</p>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
