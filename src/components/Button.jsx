export default function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-soft",
    secondary: "bg-white text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    ghost: "text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-white/10",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
