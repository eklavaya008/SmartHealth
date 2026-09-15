import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPatientAppointments, cancelMyAppointment } from '../api/appointments';
import StatusBadge from '../components/StatusBadge';

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
        <Link to="/" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Book new appointment
        </Link>
      </div>

      {loading && <p className="text-slate-500">Loading...</p>}
      {!loading && appointments.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No appointments yet. Book one from the home page.
        </p>
      )}

      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-800">{a.doctorId?.name || 'Doctor'}</p>
                <p className="text-sm text-brand-700">{a.doctorId?.specialty}</p>
                <p className="text-sm text-slate-500">{a.doctorId?.hospital}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {a.date} at {a.startTime}
            </p>
            <p className="mt-1 text-sm text-slate-500">Symptoms: {a.symptoms}</p>
            {a.predictedDisease && (
              <p className="mt-1 text-xs text-slate-400">
                Predicted: {a.predictedDisease} ({a.predictionConfidence}% confidence)
              </p>
            )}
            {['pending', 'confirmed'].includes(a.status) && (
              <button
                onClick={() => handleCancel(a._id)}
                disabled={busyId === a._id}
                className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {busyId === a._id ? 'Cancelling...' : 'Cancel appointment'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
