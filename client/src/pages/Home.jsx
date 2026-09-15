import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CalendarClock, Stethoscope, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listDoctors } from '../api/doctors';
import { bookAppointment } from '../api/appointments';
import PredictionPanel from '../components/PredictionPanel';
import DoctorCard from '../components/DoctorCard';
import SlotPicker from '../components/SlotPicker';
import Button from '../components/ui/Button';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Admin-verified doctors' },
  { icon: CalendarClock, label: 'Real-time slot booking' },
  { icon: Stethoscope, label: '8 medical specialties' },
];

export default function Home() {
  const { role } = useAuth();
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      <section className="relative overflow-hidden px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
          <div className="animate-blob absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-brand-200/50 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-accent-200/50 blur-3xl" />
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
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Find the right doctor, <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">faster</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Describe your symptoms and get matched with the right specialty, then book a real appointment slot in
            minutes.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Icon className="h-4 w-4 text-brand-600" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
    </div>
  );
}
