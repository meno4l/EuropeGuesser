import { Award, CircleCheck, CircleX, Clock, RotateCcw, Target } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import { usePlayer } from "../hooks/usePlayer";

function formatDuration(totalSeconds) {
  if (totalSeconds == null) return "-";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function Stats() {
  const { profile, accuracy, resetProfile } = usePlayer();
  const totalAnswers = profile.correctAnswers + profile.wrongAnswers;

  function resetStats() {
    if (!window.confirm("Reset all stats and badges? Your player name will stay the same.")) return;
    resetProfile();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Profile</p>
          <h1 className="mt-2 text-4xl font-extrabold">{profile.name}'s statistics</h1>
        </div>
        <Button variant="danger" onClick={resetStats}>
          <RotateCcw size={18} aria-hidden="true" />
          Reset stats
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={CircleCheck} label="Correct" value={profile.correctAnswers} />
        <StatCard icon={CircleX} label="Wrong" value={profile.wrongAnswers} tone="rose" />
        <StatCard icon={Target} label="Accuracy" value={`${accuracy}%`} tone="sky" />
        <StatCard icon={Clock} label="Fastest Europe" value={formatDuration(profile.fastestEuropeRunSeconds)} tone="sky" />
        <StatCard icon={Award} label="Badges" value={profile.achievements.length} tone="amber" />
      </section>

      <Card>
        <h2 className="text-xl font-extrabold">Answer balance</h2>
        <div className="mt-5 h-5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-label="Correct and wrong answer ratio">
          <div className="h-full bg-emerald-500" style={{ width: `${totalAnswers ? (profile.correctAnswers / totalAnswers) * 100 : 0}%` }} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total answers</p>
            <p className="text-2xl font-extrabold">{totalAnswers}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total score</p>
            <p className="text-2xl font-extrabold">{profile.totalScore}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Quizzes played</p>
            <p className="text-2xl font-extrabold">{profile.quizzesPlayed}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
