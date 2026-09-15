export default function DoctorCard({ doctor, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(doctor)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-slate-200 bg-white hover:border-brand-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-slate-800">{doctor.name}</p>
          <p className="text-sm text-brand-700">{doctor.specialty}</p>
        </div>
        <span className="text-xs text-slate-500">{doctor.experience}+ yrs</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {doctor.qualifications} &middot; {doctor.hospital}
      </p>
      {doctor.bio && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{doctor.bio}</p>}
    </button>
  );
}
