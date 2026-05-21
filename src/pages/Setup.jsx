import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Card from "../components/Card";
import { usePlayer } from "../hooks/usePlayer";

export default function Setup() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { createPlayer } = usePlayer();
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Use at least 2 characters.");
      return;
    }
    createPlayer(name);
    navigate("/dashboard");
  }

  return (
    <main className="app-shell grid min-h-screen place-items-center px-4 py-10 text-slate-950 dark:text-white">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
        <Card>
          <div className="mx-auto grid size-16 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <Compass size={32} aria-hidden="true" />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Welcome to</p>
            <h1 className="mt-2 text-4xl font-extrabold">EuropeGuesser</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Set up your player profile and your progress will be remembered on this device.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Player name</span>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-950 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Alex"
                autoComplete="given-name"
                autoFocus
              />
            </label>
            {error && <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">{error}</p>}
            <Button className="w-full" type="submit">Start learning</Button>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}
