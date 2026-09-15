import { useEffect, useState } from 'react';
import { getSlots } from '../api/appointments';

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
      <label className="mb-1 block text-sm font-medium text-slate-700">Appointment date</label>
      <input
        type="date"
        min={today}
        max={maxDate}
        value={date}
        onChange={(e) => {
          onDateChange(e.target.value);
          onSelectSlot('');
        }}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />

      {date && (
        <div className="mt-3">
          <p className="mb-2 text-sm font-medium text-slate-700">Available times</p>
          {loading && <p className="text-sm text-slate-500">Loading slots...</p>}
          {!loading && slots.length === 0 && (
            <p className="text-sm text-slate-500">No open slots on this date. Try another day.</p>
          )}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot.startTime}
                onClick={() => onSelectSlot(slot.startTime)}
                className={`rounded-lg border px-2 py-1.5 text-sm transition ${
                  selectedSlot === slot.startTime
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-300 text-slate-700 hover:border-brand-400'
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
