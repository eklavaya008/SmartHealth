import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listDoctors } from '../api/doctors';
import { bookAppointment } from '../api/appointments';
import PredictionPanel from '../components/PredictionPanel';
import DoctorCard from '../components/DoctorCard';
import SlotPicker from '../components/SlotPicker';

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
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Appointment requested</h1>
        <p className="mt-2 text-slate-600">
          Your booking with {selectedDoctor?.name} on {date} at {startTime} is pending confirmation.
        </p>
        <Link to="/patient/dashboard" className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-white">
          View my appointments
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white px-4 py-16 text-center sm:px-6">
        <h1 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Find the right doctor, faster
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Describe your symptoms and get matched with the right specialty, then book a real appointment slot in
          minutes.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <label className="mb-1 block text-sm font-medium text-slate-700">Describe your symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
            placeholder="e.g. I've had a headache and dizziness since yesterday"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
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
            <button
              onClick={handleBook}
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting
                ? 'Booking...'
                : role === 'patient'
                  ? `Book ${date} at ${startTime}`
                  : 'Log in as patient to book'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
