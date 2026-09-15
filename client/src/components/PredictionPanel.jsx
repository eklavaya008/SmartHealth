import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { predictSymptoms } from '../api/predict';
import { specialtyIcon } from '../specialtyIcons';

const CONFIDENCE_COLOR = (pct) => {
  if (pct >= 65) return 'bg-brand-600';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-slate-400';
};

export default function PredictionPanel({ symptoms, selectedSpecialty, onSelectSpecialty }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMatch, setHasMatch] = useState(false);
  const debounceRef = useRef(null);
  const autoSelectedRef = useRef(false);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!symptoms || symptoms.trim().length < 3) {
      setResults([]);
      setHasMatch(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await predictSymptoms(symptoms.trim());
        setResults(data.results);
        setHasMatch(data.hasMatch);
        if (data.hasMatch && !autoSelectedRef.current) {
          onSelectSpecialty(data.results[0].specialty);
          autoSelectedRef.current = true;
        }
      } catch {
        setResults([]);
        setHasMatch(false);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [symptoms]);

  if (!symptoms || symptoms.trim().length < 3) return null;

  return (
    <div className="mt-3 rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-accent-50/40 p-4 dark:border-brand-900/40 dark:from-brand-950/30 dark:to-accent-950/20">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-800 dark:text-brand-300">
        <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        Symptom Insight
        {loading && <span className="text-xs font-normal text-brand-600 dark:text-brand-400">analyzing...</span>}
      </div>

      {!loading && hasMatch && (
        <div className="space-y-2">
          {results.map((r, i) => {
            const active = selectedSpecialty === r.specialty;
            const Icon = specialtyIcon(r.specialty);
            return (
              <button
                type="button"
                key={r.disease}
                onClick={() => onSelectSpecialty(r.specialty)}
                className={`block w-full rounded-lg border p-3 text-left transition ${
                  active
                    ? 'border-brand-500 bg-white shadow-sm dark:bg-slate-900'
                    : 'border-transparent bg-white/60 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {i === 0 && <span className="mr-1.5 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Top match</span>}
                        {r.disease}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Suggested specialty: {r.specialty}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-200">{r.confidence}%</span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${CONFIDENCE_COLOR(r.confidence)}`}
                    style={{ width: `${r.confidence}%` }}
                  />
                </div>

                {r.matchedSymptoms.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.matchedSymptoms.map((s) => (
                      <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!loading && !hasMatch && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No specific pattern matched yet — try describing symptoms in more detail, or continue with General Medicine.
        </p>
      )}

      <p className="mt-3 text-[11px] leading-snug text-slate-500 dark:text-slate-500">
        This is automated, keyword-based guidance to help you pick a specialty — not a medical diagnosis. Always consult
        the doctor for an accurate assessment.
      </p>
    </div>
  );
}
