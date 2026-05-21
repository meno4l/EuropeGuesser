import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import Card from "./Card";
import DifficultySelect from "./DifficultySelect";
import EuropeMap from "./EuropeMap";
import ProgressBar from "./ProgressBar";
import { usePlayer } from "../hooks/usePlayer";
import { countriesForDifficulty, makeQuestion, scoreAnswer } from "../utils/quiz";

const questionLimit = 8;

export default function QuizRunner({ mode, title, description }) {
  const { completeQuiz } = usePlayer();
  const [difficulty, setDifficulty] = useState("medium");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState(() => makeQuestion(mode, countriesForDifficulty("medium")));
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const pool = useMemo(() => countriesForDifficulty(difficulty), [difficulty]);

  function reset(nextDifficulty = difficulty) {
    const nextPool = countriesForDifficulty(nextDifficulty);
    setDifficulty(nextDifficulty);
    setQuestionNumber(1);
    setQuestion(makeQuestion(mode, nextPool));
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setStreak(0);
    setBestStreak(0);
    setFinished(false);
  }

  function answer(option) {
    if (feedback) return;
    const isCorrect = option.id === question.country.id;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const gained = scoreAnswer(isCorrect, nextStreak, difficulty);

    setSelected(option.id);
    setFeedback({ isCorrect, gained });
    setScore((current) => current + gained);
    setCorrect((current) => current + (isCorrect ? 1 : 0));
    setWrong((current) => current + (isCorrect ? 0 : 1));
    setStreak(nextStreak);
    setBestStreak((current) => Math.max(current, nextStreak));
  }

  function next() {
    if (questionNumber === questionLimit) {
      const result = {
        score,
        correct,
        wrong,
        bestStreak,
      };
      completeQuiz(result);
      setFinished(true);
      return;
    }

    setQuestionNumber((current) => current + 1);
    setQuestion(makeQuestion(mode, pool));
    setSelected(null);
    setFeedback(null);
  }

  if (finished) {
    const accuracy = Math.round((correct / questionLimit) * 100);
    return (
      <Card className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Results</p>
        <h1 className="mt-3 text-4xl font-extrabold text-slate-950 dark:text-white">Quiz complete</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {[
            ["Score", score],
            ["Correct", correct],
            ["Accuracy", `${accuracy}%`],
            ["Best streak", bestStreak],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
              <p className="text-2xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()}>
            <RotateCcw size={18} aria-hidden="true" />
            Play again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">{mode === "mixed" ? "Mixed mode" : `${mode} quiz`}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{description}</p>
          </div>
          <DifficultySelect
            value={difficulty}
            onChange={(nextDifficulty) => {
              reset(nextDifficulty);
            }}
          />
        </div>

        <Card>
          <ProgressBar value={questionNumber} max={questionLimit} label="Question progress" />
          <AnimatePresence mode="wait">
            <motion.div key={`${question.type}-${question.country.id}-${questionNumber}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
              <div className="mt-7">
                <p className="text-xl font-extrabold text-slate-950 dark:text-white">{question.prompt}</p>

                {question.type === "flag" && (
                  <div className="mt-6 grid min-h-36 place-items-center rounded-lg bg-slate-100 text-8xl dark:bg-slate-800" aria-label={`Flag for ${question.country.name}`}>
                    {question.country.flag}
                  </div>
                )}

                {question.type === "map" ? (
                  <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-sky-50 dark:border-slate-700 dark:bg-slate-800">
                    <EuropeMap targetId={question.country.id} selectedId={selected} onSelect={(country) => answer(country)} disabled={Boolean(feedback)} />
                  </div>
                ) : (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {question.options.map((option) => {
                      const picked = selected === option.id;
                      const correctOption = feedback && option.id === question.country.id;
                      const wrongPick = feedback && picked && option.id !== question.country.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => answer(option)}
                          className={`min-h-16 rounded-lg border px-4 py-3 text-left font-bold transition ${
                            correctOption
                              ? "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100"
                              : wrongPick
                                ? "border-rose-500 bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-100"
                                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800"
                          }`}
                          disabled={Boolean(feedback)}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {feedback && (
            <div className={`mt-6 flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between ${feedback.isCorrect ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100" : "bg-rose-100 text-rose-900 dark:bg-rose-500/15 dark:text-rose-100"}`} role="status">
              <div className="flex items-center gap-3 font-bold">
                {feedback.isCorrect ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
                <span>{feedback.isCorrect ? `Correct. +${feedback.gained} points` : `Not quite. Answer: ${question.answer}`}</span>
              </div>
              <Button onClick={next}>{questionNumber === questionLimit ? "See results" : "Next"}</Button>
            </div>
          )}
        </Card>
      </section>

      <aside className="space-y-4">
        <Card>
          <h2 className="text-lg font-extrabold">Session</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["Score", score],
              ["Correct", correct],
              ["Wrong", wrong],
              ["Streak", streak],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
                <dd className="text-2xl font-extrabold">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card>
          <h2 className="text-lg font-extrabold">Mode Focus</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Easy keeps the classics close. Medium adds more neighboring countries. Hard opens the full EuropeGuesser set for a sharper challenge.
          </p>
        </Card>
      </aside>
    </div>
  );
}
