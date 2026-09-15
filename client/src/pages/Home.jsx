import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CalendarClock,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  MessageSquareText,
  UserSearch,
  CalendarCheck2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listDoctors } from '../api/doctors';
import { bookAppointment } from '../api/appointments';
import PredictionPanel from '../components/PredictionPanel';
import DoctorCard from '../components/DoctorCard';
import SlotPicker from '../components/SlotPicker';
import Button from '../components/ui/Button';
import { SPECIALTIES } from '../constants';
import { specialtyIcon } from '../specialtyIcons';

const trustBadges = (doctorCount) => [
  { icon: ShieldCheck, label: 'Admin-verified doctors' },
  { icon: CalendarClock, label: 'Real-time slot booking' },
  { icon: Stethoscope, label: doctorCount !== null ? `${doctorCount}+ verified doctors` : '8 medical specialties' },
];

const STEPS = [
  {
    icon: MessageSquareText,
    title: 'Describe your symptoms',
    text: 'Type what you\'re feeling in plain language — our engine looks for real medical keyword patterns, live.',
  },
  {
    icon: UserSearch,
    title: 'Get matched instantly',
    text: 'See ranked conditions with confidence scores, then browse admin-verified doctors in that specialty.',
  },
  {
    icon: CalendarCheck2,
    title: 'Book a real slot',
    text: 'Pick an actually-open time from the doctor\'s live availability — no back-and-forth, no double-booking.',
  },
];

export default function Home() {
  const { role } = useAuth();
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorCount, setDoctorCount] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    listDoctors()
      .then((all) => setDoctorCount(all.length))
      .catch(() => setDoctorCount(null));
  }, []);

  useEffect(() => {
    if (!specialty) {
      setDoctors([]);
      return;
    }
    listDoctors(specialty)
      .then(setDoctors)
      .catch(() => setDoctors([]));
    setSelectedDoctor(null);
  }, [specialty]);

  const jumpToChecker = (chosenSpecialty) => {
    setSpecialty(chosenSpecialty);
    document.getElementById('symptom-checker')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBook = async () => {
    setError('');
    if (role !== 'patient') {
      navigate('/patient/login');
      return;
    }
    if (!selectedDoctor || !date || !startTime) return;

    setSubmitting(true);
    try {
      await bookAppointment({ doctorId: selectedDoctor._id, date, startTime, symptoms });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book this appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>
        <h1 className="mt-5 font-display text-2xl font-bold text-slate-900">Appointment requested</h1>
        <p className="mt-2 text-slate-600">
          Your booking with {selectedDoctor?.name} on {date} at {startTime} is pending confirmation.
        </p>
        <Link to="/patient/dashboard" className="mt-6">
          <Button>View my appointments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
          <div className="animate-blob absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-brand-200/50 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-accent-200/50 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-100/60 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Symptom-matched, in real time
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Find the right doctor,{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 bg-clip-text text-transparent">
              faster
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Describe your symptoms and get matched with the right specialty, then book a real appointment slot in
            minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => jumpToChecker('')} className="px-6 py-3 text-sm">
              Check my symptoms <ArrowRight className="h-4 w-4" />
            </Button>
            <a href="#specialties">
              <Button variant="outline" className="px-6 py-3 text-sm">
                Browse specialties
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustBadges(doctorCount).map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Icon className="h-4 w-4 text-brand-600" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 font-display text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700">
                <Icon className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-slate-800">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section id="specialties" className="mx-auto max-w-5xl scroll-mt-20 px-4 pb-16 sm:px-6">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Browse by specialty</h2>
          <p className="mt-1 text-slate-500">Not sure where to start? Jump straight to a specialty.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SPECIALTIES.map((s, i) => {
            const Icon = specialtyIcon(s);
            return (
              <motion.button
                key={s}
                onClick={() => jumpToChecker(s)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700 transition group-hover:scale-110">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <span className="text-sm font-medium text-slate-700">{s}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Symptom checker / booking widget */}
      <section id="symptom-checker" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-20 sm:px-6">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Symptom Checker</h2>
          <p className="mt-1 text-slate-500">Tell us what's going on — we'll suggest a specialty in seconds.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8"
        >
          <label className="mb-1 block text-sm font-semibold text-slate-700">Describe your symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
            placeholder="e.g. I've had a headache and dizziness since yesterday"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          <PredictionPanel symptoms={symptoms} selectedSpecialty={specialty} onSelectSpecialty={setSpecialty} />

          {specialty && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-slate-700">
                {doctors.length > 0
                  ? `Available ${specialty} doctors`
                  : `No approved ${specialty} doctors yet — try another specialty.`}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {doctors.map((doc) => (
                  <DoctorCard
                    key={doc._id}
                    doctor={doc}
                    selected={selectedDoctor?._id === doc._id}
                    onSelect={setSelectedDoctor}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedDoctor && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <SlotPicker
                doctorId={selectedDoctor._id}
                date={date}
                onDateChange={setDate}
                selectedSlot={startTime}
                onSelectSlot={setStartTime}
              />
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {selectedDoctor && date && startTime && (
            <Button onClick={handleBook} disabled={submitting} className="mt-6 w-full">
              {submitting
                ? 'Booking...'
                : role === 'patient'
                  ? `Book ${date} at ${startTime}`
                  : 'Log in as patient to book'}
            </Button>
          )}
        </motion.div>
      </section>

      {/* CTA banner */}
      <section className="px-4 pb-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-700 px-6 py-14 text-center text-white sm:px-12"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-blob absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="animate-blob animation-delay-2000 absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Are you a doctor?</h2>
            <p className="mx-auto mt-2 max-w-md text-white/85">
              Join SmartHealth and manage your appointments, availability, and patients from one dashboard.
            </p>
            <Link to="/doctor/signup" className="mt-6 inline-block">
              <Button variant="outline" className="border-white/30 bg-white text-brand-700 hover:bg-white/90">
                Register your practice <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
