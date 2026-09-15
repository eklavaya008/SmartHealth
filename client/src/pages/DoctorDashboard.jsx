import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, ClipboardList, Users, Hourglass, CalendarCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyDoctorAppointments, updateAppointmentStatus } from '../api/appointments';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/ui/Button';

const NEXT_ACTIONS = {
  pending: [
    { to: 'confirmed', label: 'Confirm', variant: 'primary' },
    { to: 'cancelled', label: 'Decline', variant: 'danger' },
  ],
  confirmed: [
    { to: 'completed', label: 'Mark completed', variant: 'primary' },
    { to: 'cancelled', label: 'Cancel', variant: 'danger' },
  ],
  completed: [],
  cancelled: [],
};

const STAT_CARDS = [
  { key: 'total', label: 'Total', icon: Users, style: 'bg-slate-100 text-slate-700' },
  { key: 'pending', label: 'Pending', icon: Hourglass, style: 'bg-amber-100 text-amber-700' },
  { key: 'confirmed', label: 'Confirmed', icon: CalendarCheck, style: 'bg-blue-100 text-blue-700' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, style: 'bg-emerald-100 text-emerald-700' },
];

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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
          <p className="text-sm text-slate-500">Manage your incoming appointments.</p>
        </div>
        <Link to="/doctor/profile">
          <Button variant="outline">
            <Settings className="h-4 w-4" /> Profile & availability
          </Button>
        </Link>
      </div>

      {user?.status === 'pending' && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Your profile is pending admin approval. You'll be listed publicly and start receiving bookings once
          approved.
        </div>
      )}
      {user?.status === 'rejected' && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Your application was not approved. Reason: {user.rejectionReason || 'Not specified.'}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, style }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
          >
            <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${style}`}>
              <Icon className="h-4.5 w-4.5" />
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-800">{counts[key] || 0}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </motion.div>
        ))}
      </div>

      {loading && <p className="text-slate-500">Loading...</p>}
      {!loading && appointments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <ClipboardList className="mx-auto h-9 w-9 text-slate-300" />
          <p className="mt-3 text-slate-500">No appointments yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
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
                  <Button
                    key={action.to}
                    variant={action.variant}
                    onClick={() => handleTransition(a._id, action.to)}
                    disabled={busyId === a._id}
                    className="px-3 py-1.5 text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
