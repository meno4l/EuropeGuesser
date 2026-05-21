import { Link } from "react-router-dom";
import { Brain, Flag, Globe2, LayoutDashboard, LocateFixed, MapPinned, Play } from "lucide-react";
import Card from "../components/Card";
import EuropeMap from "../components/EuropeMap";
import FlagImage from "../components/FlagImage";
import { usePlayer } from "../hooks/usePlayer";
import countries from "../data/countries.json";
import { practiceRegions } from "../data/practiceRegions";

const modes = [
  { to: "/quiz/capitals", title: "Capital Sprint", text: "Match countries to capital cities.", icon: Brain, tone: "bg-emerald-500" },
  { to: "/quiz/europe", title: "Europe Country Run", text: "Find every country on the map once.", icon: LocateFixed, tone: "bg-cyan-500" },
  { to: "/quiz/flags", title: "Flag Focus", text: "Identify countries from their flags.", icon: Flag, tone: "bg-amber-500" },
  { to: "/quiz/mixed", title: "Mixed Challenge", text: "A rotating blend of every mode.", icon: Globe2, tone: "bg-rose-500" },
];

const featuredIds = ["fr", "de", "it", "es", "se", "gr"];
const featuredCountries = countries.filter((country) => featuredIds.includes(country.id));

export default function Home() {
  const { profile } = usePlayer();

  return (
    <div className="space-y-8">
      <section className="grid min-h-[420px] items-center gap-8 py-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Geography practice</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-6xl">EuropeGuesser</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            Learn European capitals, flags, and map locations through fast, friendly quiz rounds built for repeat practice.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/quiz/mixed" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-emerald-600">
              <Play size={18} aria-hidden="true" />
              Start mixed quiz
            </Link>
            <Link to="/dashboard" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
              <LayoutDashboard size={18} aria-hidden="true" />
              View dashboard
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/70 bg-white/85 shadow-soft backdrop-blur dark:border-white/10 dark:bg-slate-900/85">
          <EuropeMap disabled highlightIds={featuredIds} className="block" />
          <div className="grid grid-cols-3 border-t border-slate-200 bg-white/90 dark:border-white/10 dark:bg-slate-950/60 sm:grid-cols-6">
            {featuredCountries.map((country) => (
              <div key={country.id} className="flex min-h-24 flex-col items-center justify-center gap-2 border-r border-slate-200 px-3 py-3 text-center last:border-r-0 dark:border-white/10">
                <FlagImage country={country} className="h-9 w-14 rounded-sm object-cover shadow-sm" />
                <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-300">{country.id}</span>
              </div>
            ))}
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

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <MapPinned size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Practice by region</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Short map runs for the places that need extra reps.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {practiceRegions.map((region) => (
            <Link
              key={region.id}
              to={`/quiz/practice/${region.id}`}
              className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900/85"
            >
              <h3 className="font-extrabold">{region.label}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{region.countryIds.length} countries</p>
            </Link>
          ))}
        </div>
      </section>

      <Card>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Welcome back, {profile.name}.</p>
        <p className="mt-2 text-2xl font-extrabold">Your next best score is waiting.</p>
      </Card>
    </div>
  );
}
