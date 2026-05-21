export default function ProgressBar({ value, max, label }) {
  const width = Math.min(100, Math.round((value / max) * 100));
  return (
    <div aria-label={label} role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max}>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-400 transition-all" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
