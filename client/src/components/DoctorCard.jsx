import { Clock } from 'lucide-react';
import { specialtyIcon } from '../specialtyIcons';

const initials = (name) =>
  name
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function DoctorCard({ doctor, selected, onSelect }) {
  const Icon = specialtyIcon(doctor.specialty);

  return (
    <button
      type="button"
      onClick={() => onSelect(doctor)}
      className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-brand-500 bg-brand-50 shadow-md shadow-brand-500/10'
          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
            selected ? 'bg-brand-600 text-white' : 'bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700'
          }`}
        >
          {initials(doctor.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-semibold text-slate-800">{doctor.name}</p>
            <span className="shrink-0 text-xs text-slate-500">{doctor.experience}+ yrs</span>
          </div>
          <p className="flex items-center gap-1 text-sm text-brand-700">
            <Icon className="h-3.5 w-3.5" />
            {doctor.specialty}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {doctor.qualifications} &middot; {doctor.hospital}
          </p>
        </div>
      </div>
      {doctor.bio && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{doctor.bio}</p>}
      {doctor.availability?.length > 0 && (
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3 w-3" /> {doctor.availability.length} weekly availability window
          {doctor.availability.length > 1 ? 's' : ''}
        </p>
      )}
    </button>
  );
}
