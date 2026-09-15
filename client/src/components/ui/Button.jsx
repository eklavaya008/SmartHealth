import { twMerge } from 'tailwind-merge';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/20 hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5 active:translate-y-0',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  dark: 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg shadow-slate-800/20 hover:-translate-y-0.5',
};

export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={twMerge(
        `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 ${VARIANTS[variant]}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
