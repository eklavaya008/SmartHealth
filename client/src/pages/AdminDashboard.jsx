import { useEffect, useState } from 'react';
import { listDoctorsByStatus, updateDoctorStatus } from '../api/admin';
import StatusBadge from '../components/StatusBadge';

const TABS = ['pending', 'approved', 'rejected', 'deactivated'];

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
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      <p className="text-sm text-slate-500">Review and manage doctor accounts.</p>

      <div className="mt-6 flex gap-2 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-3 py-2 text-sm font-medium capitalize ${
              tab === t ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {loading && <p className="text-slate-500">Loading...</p>}
        {!loading && doctors.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No {tab} doctors.
          </p>
        )}

        {doctors.map((doc) => (
          <div key={doc._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-800">{doc.name}</p>
                <p className="text-sm text-brand-700">{doc.specialty}</p>
                <p className="text-sm text-slate-500">
                  {doc.email} &middot; {doc.hospital} &middot; License {doc.licenseNumber}
                </p>
                <p className="text-sm text-slate-500">
                  {doc.qualifications} &middot; {doc.experience} yrs experience
                </p>
              </div>
              <StatusBadge status={doc.status} />
            </div>

            {doc.status === 'pending' && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => act(doc._id, 'approved')}
                  disabled={busyId === doc._id}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  Approve
                </button>
                <input
                  placeholder="Rejection reason"
                  value={reasonDraft[doc._id] || ''}
                  onChange={(e) => setReasonDraft({ ...reasonDraft, [doc._id]: e.target.value })}
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                />
                <button
                  onClick={() => act(doc._id, 'rejected', reasonDraft[doc._id])}
                  disabled={busyId === doc._id || !reasonDraft[doc._id]?.trim()}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            )}

            {doc.status === 'approved' && (
              <button
                onClick={() => act(doc._id, 'deactivated')}
                disabled={busyId === doc._id}
                className="mt-3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Deactivate
              </button>
            )}

            {(doc.status === 'deactivated' || doc.status === 'rejected') && (
              <button
                onClick={() => act(doc._id, 'approved')}
                disabled={busyId === doc._id}
                className="mt-3 rounded-lg bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700 disabled:opacity-60"
              >
                Approve
              </button>
            )}

            {doc.status === 'rejected' && doc.rejectionReason && (
              <p className="mt-2 text-xs text-red-600">Reason: {doc.rejectionReason}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
