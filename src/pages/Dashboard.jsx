import { Link } from "react-router-dom";
import { BarChart3, Flame, Medal, Percent, Play, Trophy } from "lucide-react";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import { usePlayer } from "../hooks/usePlayer";

export default function Dashboard() {
  const { profile, accuracy } = usePlayer();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Dashboard</p>
          <h1 className="mt-2 text-4xl font-extrabold">Ready, {profile.name}?</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Choose a mode and keep your geography streak moving.</p>
        </div>
        <Link to="/quiz/mixed" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-emerald-600">
          <Play size={18} aria-hidden="true" />
          Quick play
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Trophy} label="Total score" value={profile.totalScore} />
        <StatCard icon={Medal} label="High score" value={profile.highScore} tone="amber" />
        <StatCard icon={BarChart3} label="Quizzes" value={profile.quizzesPlayed} tone="sky" />
        <StatCard icon={Percent} label="Accuracy" value={`${accuracy}%`} tone="rose" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <h2 className="text-xl font-extrabold">Quiz modes</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["/quiz/capitals", "Capital Guessing", "Country names, capital city answers."],
              ["/quiz/map", "Map Guessing", "Clickable SVG Europe practice."],
              ["/quiz/flags", "Flag Quiz", "Visual recognition with instant feedback."],
              ["/quiz/mixed", "Mixed Challenge", "Random capitals, flags, and maps."],
            ].map(([to, title, text]) => (
              <Link key={to} to={to} className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="font-extrabold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200">
              <Flame aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Best streak</p>
              <p className="text-3xl font-extrabold">{profile.bestStreak}</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="font-extrabold">Badges</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(profile.achievements.length ? profile.achievements : ["Play a quiz to unlock badges"]).map((badge) => (
                <span key={badge} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800">{badge}</span>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
