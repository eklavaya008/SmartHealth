import { Clock, CheckCircle2, XCircle, Hourglass, ShieldCheck, ShieldX } from 'lucide-react';

const CONFIG = {
  pending: { style: 'bg-amber-100 text-amber-800', icon: Hourglass },
  confirmed: { style: 'bg-blue-100 text-blue-800', icon: Clock },
  completed: { style: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  cancelled: { style: 'bg-slate-200 text-slate-600', icon: XCircle },
  approved: { style: 'bg-emerald-100 text-emerald-800', icon: ShieldCheck },
  rejected: { style: 'bg-red-100 text-red-800', icon: ShieldX },
  deactivated: { style: 'bg-slate-200 text-slate-600', icon: XCircle },
};

export default function StatusBadge({ status }) {
  const { style, icon: Icon } = CONFIG[status] || { style: 'bg-slate-100 text-slate-600', icon: Clock };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}
