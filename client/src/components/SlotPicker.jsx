import { useEffect, useState } from 'react';
import { CalendarDays, Clock3 } from 'lucide-react';
import { getSlots } from '../api/appointments';
import TextField from './ui/TextField';

export default function SlotPicker({ doctorId, date, onDateChange, selectedSlot, onSelectSlot }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10);

  useEffect(() => {
    if (!doctorId || !date) {
      setSlots([]);
      return;
    }
    setLoading(true);
    getSlots(doctorId, date)
      .then((data) => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [doctorId, date]);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Appointment date</label>
      <TextField
        icon={CalendarDays}
        type="date"
        min={today}
        max={maxDate}
        value={date}
        onChange={(e) => {
          onDateChange(e.target.value);
          onSelectSlot('');
        }}
      />

      {date && (
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Clock3 className="h-4 w-4 text-slate-400 dark:text-slate-500" /> Available times
          </p>
          {loading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading slots...</p>}
          {!loading && slots.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No open slots on this date. Try another day.</p>
          )}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot.startTime}
                onClick={() => onSelectSlot(slot.startTime)}
                className={`rounded-lg border px-2 py-1.5 text-sm font-medium transition-all ${
                  selectedSlot === slot.startTime
                    ? 'border-brand-600 bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'border-slate-300 text-slate-700 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-sm dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-500'
                }`}
              >
                {slot.startTime}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
