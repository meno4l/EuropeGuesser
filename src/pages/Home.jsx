import { Link } from "react-router-dom";
import { Brain, Flag, Globe2, MapPinned } from "lucide-react";
import Card from "../components/Card";
import { usePlayer } from "../hooks/usePlayer";

const modes = [
  { to: "/quiz/capitals", title: "Capital Sprint", text: "Match countries to capital cities.", icon: Brain, tone: "bg-emerald-500" },
  { to: "/quiz/map", title: "Map Finder", text: "Click the requested country.", icon: MapPinned, tone: "bg-sky-500" },
  { to: "/quiz/flags", title: "Flag Focus", text: "Identify countries from their flags.", icon: Flag, tone: "bg-amber-500" },
  { to: "/quiz/mixed", title: "Mixed Challenge", text: "A rotating blend of every mode.", icon: Globe2, tone: "bg-rose-500" },
];

export default function Home() {
  const { profile } = usePlayer();

  return (
    <div className="space-y-8">
      <section className="grid min-h-[420px] items-center gap-8 py-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Geography practice</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-6xl">EuropeGuesser</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            Learn European capitals, flags, and map locations through fast, friendly quiz rounds built for repeat practice.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/quiz/mixed" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-emerald-600">Start mixed quiz</Link>
            <Link to="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">View dashboard</Link>
          </div>
        </div>

        <div className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
          <div className="grid aspect-[4/3] place-items-center rounded-lg bg-gradient-to-br from-sky-100 via-emerald-100 to-amber-100 p-5 dark:from-slate-800 dark:via-slate-700 dark:to-emerald-950">
            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              {["🇫🇷", "🇩🇪", "🇬🇷", "🇳🇴", "🇵🇹", "🇷🇴", "🇸🇪", "🇮🇹", "🇪🇸"].map((flag) => (
                <div key={flag} className="grid aspect-square place-items-center rounded-lg bg-white text-4xl shadow-sm dark:bg-slate-900">
                  {flag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modes.map((mode) => (
          <Link key={mode.to} to={mode.to} className="group">
            <Card className="h-full transition group-hover:-translate-y-1 group-hover:border-emerald-300">
              <div className={`grid size-12 place-items-center rounded-lg text-white ${mode.tone}`}>
                <mode.icon size={24} aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold">{mode.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{mode.text}</p>
            </Card>
          </Link>
        ))}
      </section>

      <Card>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Welcome back, {profile.name}.</p>
        <p className="mt-2 text-2xl font-extrabold">Your next best score is waiting.</p>
      </Card>
    </div>
  );
}
