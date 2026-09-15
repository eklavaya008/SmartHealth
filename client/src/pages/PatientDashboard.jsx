import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarPlus, MapPin, Stethoscope, ClipboardList, CalendarClock } from 'lucide-react';
import { getMyPatientAppointments, cancelMyAppointment } from '../api/appointments';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/ui/Button';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    getMyPatientAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    setBusyId(id);
    try {
      await cancelMyAppointment(id);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">My Appointments</h1>
          <p className="text-sm text-slate-500">Track and manage your upcoming and past visits.</p>
        </div>
        <Link to="/">
          <Button>
            <CalendarPlus className="h-4 w-4" /> Book new appointment
          </Button>
        </Link>
      </div>

      {loading && <p className="text-slate-500">Loading...</p>}
      {!loading && appointments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <ClipboardList className="mx-auto h-9 w-9 text-slate-300" />
          <p className="mt-3 text-slate-500">No appointments yet. Book one from the home page.</p>
        </div>
      )}

      <div className="space-y-3">
        {appointments.map((a, i) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-800">{a.doctorId?.name || 'Doctor'}</p>
                <p className="flex items-center gap-1 text-sm text-brand-700">
                  <Stethoscope className="h-3.5 w-3.5" /> {a.doctorId?.specialty}
                </p>
                <p className="flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {a.doctorId?.hospital}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              {a.date} at {a.startTime}
            </p>
            <p className="mt-1 text-sm text-slate-500">Symptoms: {a.symptoms}</p>
            {a.predictedDisease && (
              <p className="mt-1 text-xs text-slate-400">
                Predicted: {a.predictedDisease} ({a.predictionConfidence}% confidence)
              </p>
            )}
            {['pending', 'confirmed'].includes(a.status) && (
              <Button
                variant="danger"
                onClick={() => handleCancel(a._id)}
                disabled={busyId === a._id}
                className="mt-3 px-3 py-1.5 text-xs"
              >
                {busyId === a._id ? 'Cancelling...' : 'Cancel appointment'}
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
