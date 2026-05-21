import Card from "./Card";

export default function StatCard({ icon: Icon, label, value, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`grid size-11 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-extrabold text-slate-950 dark:text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
}
