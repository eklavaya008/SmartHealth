import { useState } from 'react';
import { UserCog, CalendarClock, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile, updateMyAvailability } from '../api/doctors';
import { SPECIALTIES, WEEKDAYS } from '../constants';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

export default function DoctorProfile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    specialty: user?.specialty || SPECIALTIES[0],
    qualifications: user?.qualifications || '',
    experience: user?.experience ?? 0,
    hospital: user?.hospital || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [availability, setAvailability] = useState(user?.availability || []);
  const [profileMsg, setProfileMsg] = useState('');
  const [availMsg, setAvailMsg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAvail, setSavingAvail] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      await updateMyProfile({ ...form, experience: Number(form.experience) });
      await refresh();
      setProfileMsg('Profile updated.');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const addRule = () => setAvailability([...availability, { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotMinutes: 30 }]);
  const updateRule = (i, field, value) =>
    setAvailability(availability.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  const removeRule = (i) => setAvailability(availability.filter((_, idx) => idx !== i));

  const saveAvailability = async (e) => {
    e.preventDefault();
    setSavingAvail(true);
    setAvailMsg('');
    try {
      await updateMyAvailability(
        availability.map((r) => ({ ...r, dayOfWeek: Number(r.dayOfWeek), slotMinutes: Number(r.slotMinutes) }))
      );
      await refresh();
      setAvailMsg('Availability updated.');
    } catch (err) {
      setAvailMsg(err.response?.data?.message || 'Could not update availability.');
    } finally {
      setSavingAvail(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Profile & Availability</h1>

      <form onSubmit={saveProfile} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 sm:col-span-2 dark:text-slate-100">
          <UserCog className="h-5 w-5 text-brand-600 dark:text-brand-400" /> Profile
        </h2>
        <TextField value={form.name} onChange={set('name')} placeholder="Name" />
        <TextField as="select" value={form.specialty} onChange={set('specialty')}>
          {SPECIALTIES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </TextField>
        <TextField value={form.qualifications} onChange={set('qualifications')} placeholder="Qualifications" />
        <TextField type="number" min="0" value={form.experience} onChange={set('experience')} placeholder="Experience (years)" />
        <TextField value={form.hospital} onChange={set('hospital')} placeholder="Hospital" />
        <TextField value={form.phone} onChange={set('phone')} placeholder="Phone" />
        <div className="sm:col-span-2">
          <TextField as="textarea" value={form.bio} onChange={set('bio')} placeholder="Bio" rows={3} />
        </div>
        {profileMsg && <p className="text-sm text-slate-600 sm:col-span-2 dark:text-slate-400">{profileMsg}</p>}
        <Button type="submit" disabled={savingProfile} className="w-full sm:col-span-2">
          {savingProfile ? 'Saving...' : 'Save profile'}
        </Button>
      </form>

      <form onSubmit={saveAvailability} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <CalendarClock className="h-5 w-5 text-brand-600 dark:text-brand-400" /> Weekly Availability
        </h2>
        <div className="mt-3 space-y-2">
          {availability.map((rule, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
              <select
                value={rule.dayOfWeek}
                onChange={(e) => updateRule(i, 'dayOfWeek', e.target.value)}
                className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {WEEKDAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={rule.startTime}
                onChange={(e) => updateRule(i, 'startTime', e.target.value)}
                className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
              <span className="text-slate-400 dark:text-slate-500">to</span>
              <input
                type="time"
                value={rule.endTime}
                onChange={(e) => updateRule(i, 'endTime', e.target.value)}
                className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
              <input
                type="number"
                min="5"
                max="240"
                value={rule.slotMinutes}
                onChange={(e) => updateRule(i, 'slotMinutes', e.target.value)}
                className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                title="Slot length (minutes)"
              />
              <span className="text-xs text-slate-400 dark:text-slate-500">min slots</span>
              <button
                type="button"
                onClick={() => removeRule(i)}
                className="ml-auto flex items-center gap-1 text-sm text-red-600 hover:underline dark:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRule}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
        >
          <Plus className="h-4 w-4" /> Add availability window
        </button>
        {availMsg && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{availMsg}</p>}
        <Button type="submit" disabled={savingAvail} className="mt-4 w-full">
          {savingAvail ? 'Saving...' : 'Save availability'}
        </Button>
      </form>
    </div>
  );
}
