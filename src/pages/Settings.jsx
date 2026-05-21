import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { usePlayer } from "../hooks/usePlayer";

export default function Settings() {
  const { profile, resetProfile, theme, setTheme } = usePlayer();
  const navigate = useNavigate();

  function reset() {
    resetProfile();
    navigate("/setup");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Settings</p>
        <h1 className="mt-2 text-4xl font-extrabold">Player preferences</h1>
      </div>

      <Card>
        <h2 className="text-xl font-extrabold">Profile</h2>
        <div className="mt-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Current player</p>
          <p className="text-2xl font-extrabold">{profile.name}</p>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-extrabold">Theme</h2>
        <div className="mt-4 inline-flex rounded-lg bg-slate-200 p-1 dark:bg-slate-800" role="group" aria-label="Theme">
          {["light", "dark"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              className={`rounded-md px-4 py-2 text-sm font-bold capitalize transition ${theme === option ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-extrabold">Local data</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Resetting clears your saved name, scores, accuracy, badges, and quiz history from this browser.</p>
        <Button variant="danger" className="mt-5" onClick={reset}>
          <Trash2 size={18} aria-hidden="true" />
          Reset progress
        </Button>
      </Card>
    </div>
  );
}
