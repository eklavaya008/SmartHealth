import { twMerge } from 'tailwind-merge';

export default function TextField({ icon: Icon, className = '', as = 'input', dark = false, ...props }) {
  const Tag = as;
  const palette = dark
    ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500'
    : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500';
  return (
    <div className="relative">
      {Icon && (
        <Icon
          className={`pointer-events-none absolute left-3.5 top-3.5 h-4.5 w-4.5 ${dark ? 'text-slate-500' : 'text-slate-400 dark:text-slate-500'}`}
        />
      )}
      <Tag
        className={twMerge(
          `w-full rounded-xl border py-2.5 text-sm shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 ${palette} ${
            Icon ? 'pl-10 pr-3' : 'px-3.5'
          }`,
          className
        )}
        {...props}
      />
    </div>
  );
}
