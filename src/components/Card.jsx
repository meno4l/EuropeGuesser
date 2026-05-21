export default function Card({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-white/60 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-slate-900/80 ${className}`}>
      {children}
    </section>
  );
}
