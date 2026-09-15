import { useEffect, useState } from 'react';
import { Hourglass, ShieldCheck, ShieldX, PowerOff, Award } from 'lucide-react';
import { listDoctorsByStatus, updateDoctorStatus } from '../api/admin';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import { specialtyIcon } from '../specialtyIcons';

const TABS = [
  { key: 'pending', label: 'Pending', icon: Hourglass },
  { key: 'approved', label: 'Approved', icon: ShieldCheck },
  { key: 'rejected', label: 'Rejected', icon: ShieldX },
  { key: 'deactivated', label: 'Deactivated', icon: PowerOff },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('pending');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [reasonDraft, setReasonDraft] = useState({});

  const load = () => {
    setLoading(true);
    listDoctorsByStatus(tab)
      .then(setDoctors)
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const act = async (id, status, rejectionReason) => {
    setBusyId(id);
    try {
      await updateDoctorStatus(id, { status, rejectionReason });
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Review and manage doctor accounts.</p>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === key
                ? 'border-brand-600 text-brand-700 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {loading && <p className="text-slate-500 dark:text-slate-400">Loading...</p>}
        {!loading && doctors.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No {tab} doctors.
          </p>
        )}

        {doctors.map((doc) => {
          const Icon = specialtyIcon(doc.specialty);
          return (
            <div key={doc._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{doc.name}</p>
                  <p className="flex items-center gap-1 text-sm text-brand-700 dark:text-brand-400">
                    <Icon className="h-3.5 w-3.5" /> {doc.specialty}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {doc.email} &middot; {doc.hospital} &middot; License {doc.licenseNumber}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <Award className="h-3.5 w-3.5" /> {doc.qualifications} &middot; {doc.experience} yrs experience
                  </p>
                </div>
                <StatusBadge status={doc.status} />
              </div>

              {doc.status === 'pending' && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button onClick={() => act(doc._id, 'approved')} disabled={busyId === doc._id} className="px-3 py-1.5 text-xs">
                    Approve
                  </Button>
                  <TextField
                    placeholder="Rejection reason"
                    value={reasonDraft[doc._id] || ''}
                    onChange={(e) => setReasonDraft({ ...reasonDraft, [doc._id]: e.target.value })}
                    className="w-48 py-1.5"
                  />
                  <Button
                    variant="danger"
                    onClick={() => act(doc._id, 'rejected', reasonDraft[doc._id])}
                    disabled={busyId === doc._id || !reasonDraft[doc._id]?.trim()}
                    className="px-3 py-1.5 text-xs"
                  >
                    Reject
                  </Button>
                </div>
              )}

              {doc.status === 'approved' && (
                <Button
                  variant="outline"
                  onClick={() => act(doc._id, 'deactivated')}
                  disabled={busyId === doc._id}
                  className="mt-3 px-3 py-1.5 text-xs"
                >
                  Deactivate
                </Button>
              )}

              {(doc.status === 'deactivated' || doc.status === 'rejected') && (
                <Button onClick={() => act(doc._id, 'approved')} disabled={busyId === doc._id} className="mt-3 px-3 py-1.5 text-xs">
                  Approve
                </Button>
              )}

              {doc.status === 'rejected' && doc.rejectionReason && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">Reason: {doc.rejectionReason}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
