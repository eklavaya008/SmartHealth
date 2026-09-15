import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyDoctorAppointments, updateAppointmentStatus } from '../api/appointments';
import StatusBadge from '../components/StatusBadge';

const NEXT_ACTIONS = {
  pending: [
    { to: 'confirmed', label: 'Confirm', style: 'bg-brand-600 text-white hover:bg-brand-700' },
    { to: 'cancelled', label: 'Decline', style: 'border border-red-300 text-red-600 hover:bg-red-50' },
  ],
  confirmed: [
    { to: 'completed', label: 'Mark completed', style: 'bg-brand-600 text-white hover:bg-brand-700' },
    { to: 'cancelled', label: 'Cancel', style: 'border border-red-300 text-red-600 hover:bg-red-50' },
  ],
  completed: [],
  cancelled: [],
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    getMyDoctorAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleTransition = async (id, status) => {
    setBusyId(id);
    try {
      await updateAppointmentStatus(id, { status });
      load();
    } finally {
      setBusyId(null);
    }
  };

  const counts = appointments.reduce(
    (acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1, total: acc.total + 1 }),
    { total: 0 }
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
        <Link to="/doctor/profile" className="text-sm font-medium text-brand-700 hover:underline">
          Edit profile & availability
        </Link>
      </div>

      {user?.status === 'pending' && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Your profile is pending admin approval. You'll be listed publicly and start receiving bookings once approved.
        </div>
      )}
      {user?.status === 'rejected' && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Your application was not approved. Reason: {user.rejectionReason || 'Not specified.'}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {['total', 'pending', 'confirmed', 'completed'].map((key) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{counts[key] || 0}</p>
            <p className="text-xs capitalize text-slate-500">{key}</p>
          </div>
        ))}
      </div>

      {loading && <p className="text-slate-500">Loading...</p>}
      {!loading && appointments.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No appointments yet.
        </p>
      )}

      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-800">{a.patientId?.name || 'Patient'}</p>
                <p className="text-sm text-slate-500">
                  {a.patientId?.gender}
                  {a.patientId?.dob ? `, DOB ${new Date(a.patientId.dob).toLocaleDateString()}` : ''} &middot;{' '}
                  {a.patientId?.phone}
                </p>
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
            {NEXT_ACTIONS[a.status].length > 0 && (
              <div className="mt-3 flex gap-2">
                {NEXT_ACTIONS[a.status].map((action) => (
                  <button
                    key={action.to}
                    onClick={() => handleTransition(a._id, action.to)}
                    disabled={busyId === a._id}
                    className={`rounded-lg px-3 py-1.5 text-sm disabled:opacity-60 ${action.style}`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
