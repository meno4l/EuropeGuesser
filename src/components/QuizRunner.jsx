import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, RotateCcw, Volume2, VolumeX, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import Card from "./Card";
import EuropeMap from "./EuropeMap";
import FlagImage from "./FlagImage";
import ProgressBar from "./ProgressBar";
import { usePlayer } from "../hooks/usePlayer";
import { achievementsForResult } from "../utils/achievements";
import { countryPool, makeCountryQuestion, makeQuestion, scoreAnswer, shuffle } from "../utils/quiz";

const shortQuestionLimit = 8;
const autoAdvanceDelay = 550;
const soundPreferenceKey = "europeGuesserSound";
const mapRunModes = new Set(["countries", "region"]);
const alpineCountryIds = new Set(["at", "ch", "li", "si"]);
const pyreneesCountryIds = new Set(["ad"]);
const caucasusCountryIds = new Set(["am", "az", "ge"]);

function isMapRunMode(mode) {
  return mapRunModes.has(mode);
}

function createRound(mode, pool) {
  const questionQueue = isMapRunMode(mode) ? shuffle(pool) : [];
  return {
    questionNumber: 1,
    questionQueue,
    question: isMapRunMode(mode) ? makeCountryQuestion(questionQueue[0]) : makeQuestion(mode, pool),
  };
}

function questionLimitFor(mode, questionQueue) {
  return isMapRunMode(mode) ? questionQueue.length : shortQuestionLimit;
}

function nextQuestionFor(mode, questionQueue, questionNumber, pool) {
  return isMapRunMode(mode) ? makeCountryQuestion(questionQueue[questionNumber - 1]) : makeQuestion(mode, pool);
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function loadSoundPreference() {
  try {
    return localStorage.getItem(soundPreferenceKey) !== "muted";
  } catch {
    return true;
  }
}

function mapHintFor(country) {
  if (alpineCountryIds.has(country.id)) return "Hint: look around the Alps.";
  if (pyreneesCountryIds.has(country.id)) return "Hint: look along the Pyrenees between France and Spain.";
  if (caucasusCountryIds.has(country.id)) return "Hint: look near the Caucasus at the eastern edge of the map.";
  if (country.region === "Balkans") return "Hint: look around the Balkans.";
  if (country.region === "Baltics") return "Hint: look around the Baltic coast.";
  if (country.region === "Northern Europe") return "Hint: look toward northern Europe.";
  if (country.region === "Western Europe") return "Hint: look toward western Europe.";
  if (country.region === "Eastern Europe") return "Hint: look toward eastern Europe.";
  if (country.region === "Southern Europe") return "Hint: look along southern Europe and the Mediterranean.";
  return `Hint: look around ${country.region}.`;
}

export default function QuizRunner({ mode, regionId, title, description, pool = countryPool }) {
  const activePool = pool.length ? pool : countryPool;
  const poolKey = activePool.map((country) => country.id).join("|");
  const mapRun = isMapRunMode(mode);
  const { completeQuiz, profile } = usePlayer();
  const advanceTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const [round, setRound] = useState(() => createRound(mode, activePool));
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completedIds, setCompletedIds] = useState([]);
  const [mapWrongAttempts, setMapWrongAttempts] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [usedZoom, setUsedZoom] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(loadSoundPreference);
  const [sessionBadges, setSessionBadges] = useState([]);
  const [finished, setFinished] = useState(false);
  const { questionNumber, question, questionQueue } = round;
  const questionLimit = questionLimitFor(mode, questionQueue);
  const attempts = correct + wrong;
  const sessionAccuracy = attempts ? Math.round((correct / attempts) * 100) : 100;
  const modeEyebrow = mode === "countries" ? "Full Europe" : mode === "region" ? "Region practice" : mode === "mixed" ? "Mixed mode" : `${mode} quiz`;
  const focusCopy = mapRun
    ? "Read the prompt, find the country, and click the map. Drag to move around Europe and use the mouse wheel to zoom into small countries."
    : mode === "flag"
      ? "Study the flag, then pick the matching country. The timer keeps running until the round is complete."
      : "Pick the best answer and keep your streak alive. The timer keeps running until the round is complete.";

  useEffect(() => {
    return () => {
      window.clearTimeout(advanceTimerRef.current);
      audioContextRef.current?.close?.();
    };
  }, []);

  useEffect(() => {
    if (!mapRun) return undefined;

    function handlePageShow(event) {
      if (event.persisted) reset();
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [mapRun]);

  useEffect(() => {
    window.clearTimeout(advanceTimerRef.current);
    setRound(createRound(mode, activePool));
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setStreak(0);
    setBestStreak(0);
    setCompletedIds([]);
    setMapWrongAttempts(0);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
    setUsedZoom(false);
    setSessionBadges([]);
    setFinished(false);
  }, [mode, poolKey]);

  useEffect(() => {
    if (finished) return undefined;

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [finished, startedAt]);

  useEffect(() => {
    try {
      localStorage.setItem(soundPreferenceKey, soundEnabled ? "on" : "muted");
    } catch {
      // Sound preference is non-critical.
    }
  }, [soundEnabled]);

  function reset() {
    window.clearTimeout(advanceTimerRef.current);
    setRound(createRound(mode, activePool));
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setStreak(0);
    setBestStreak(0);
    setCompletedIds([]);
    setMapWrongAttempts(0);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
    setUsedZoom(false);
    setSessionBadges([]);
    setFinished(false);
  }

  function playFeedbackSound(isCorrect) {
    if (!soundEnabled || typeof window === "undefined") return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      const context = audioContextRef.current || new AudioContext();
      audioContextRef.current = context;
      context.resume?.();

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = isCorrect ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(isCorrect ? 660 : 220, now);
      oscillator.frequency.exponentialRampToValueAtTime(isCorrect ? 920 : 140, now + 0.12);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(isCorrect ? 0.055 : 0.045, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    } catch {
      // Some browsers block audio until they are ready; the game can continue silently.
    }
  }

  function answer(option) {
    if (feedback?.isCorrect || (feedback && question.type !== "map")) return;
    const isCorrect = option.id === question.country.id;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const gained = scoreAnswer(isCorrect, nextStreak);
    const nextScore = score + gained;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    const nextWrong = wrong + (isCorrect ? 0 : 1);
    const nextBestStreak = Math.max(bestStreak, nextStreak);
    const nextMapWrongAttempts = question.type === "map" && !isCorrect ? mapWrongAttempts + 1 : 0;

    playFeedbackSound(isCorrect);
    setSelected(option.id);
    setFeedback({ isCorrect, gained });
    setScore(nextScore);
    setCorrect(nextCorrect);
    setWrong(nextWrong);
    setStreak(nextStreak);
    setBestStreak(nextBestStreak);
    setMapWrongAttempts(nextMapWrongAttempts);

    if (question.type === "map" && isCorrect) {
      setCompletedIds((current) => (current.includes(question.country.id) ? current : [...current, question.country.id]));
    }

    if (question.type === "map" && !isCorrect) return;

    window.clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = window.setTimeout(() => {
      if (questionNumber === questionLimit) {
        const durationSeconds = Math.floor((Date.now() - startedAt) / 1000);
        const result = {
          score: nextScore,
          correct: nextCorrect,
          wrong: nextWrong,
          bestStreak: nextBestStreak,
          questionLimit,
          mode,
          regionId,
          durationSeconds,
          isMapRun: mapRun,
          usedZoom,
        };
        const badges = achievementsForResult(result, { correctAnswers: profile.correctAnswers + nextCorrect });

        setElapsedSeconds(durationSeconds);
        setSessionBadges(badges.filter((badge) => !profile.achievements.includes(badge)));
        completeQuiz(result);
        setFinished(true);
        return;
      }

      setRound((current) => {
        const nextNumber = current.questionNumber + 1;
        return {
          ...current,
          questionNumber: nextNumber,
          question: nextQuestionFor(mode, current.questionQueue, nextNumber, activePool),
        };
      });
      setSelected(null);
      setFeedback(null);
      setMapWrongAttempts(0);
    }, autoAdvanceDelay);
  }

  if (finished) {
    const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
    return (
      <Card className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Results</p>
        <h1 className="mt-3 text-4xl font-extrabold text-slate-950 dark:text-white">Quiz complete</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Score", score],
            ["Correct", correct],
            ["Accuracy", `${accuracy}%`],
            ["Best streak", bestStreak],
            ["Time", formatDuration(elapsedSeconds)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
              <p className="text-2xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>
        {sessionBadges.length > 0 && (
          <div className="mt-6 rounded-lg bg-amber-100 p-4 text-amber-950 dark:bg-amber-400/15 dark:text-amber-100">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em]">New badges</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {sessionBadges.map((badge) => (
                <span key={badge} className="rounded-lg bg-white/70 px-3 py-2 text-sm font-bold dark:bg-slate-950/40">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}
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
        <div className="mb-6">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">{modeEyebrow}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>

        <Card>
          <ProgressBar value={questionNumber} max={questionLimit} label="Question progress" />
          <AnimatePresence mode="wait">
            <motion.div key={`${question.type}-${question.country.id}-${questionNumber}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
              <div className="mt-7">
                <p className="text-xl font-extrabold text-slate-950 dark:text-white">{question.prompt}</p>

                {question.type === "flag" && (
                  <div className="mt-6 grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6 dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" aria-label={`Flag for ${question.country.name}`}>
                    <div className="grid w-full max-w-sm place-items-center rounded-lg bg-white px-6 py-5 shadow-soft dark:bg-slate-950">
                      <FlagImage country={question.country} className="max-h-44 w-full rounded-md object-contain shadow-sm" />
                    </div>
                  </div>
                )}

                {question.type === "map" ? (
                  <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-3 shadow-inner dark:border-slate-700 dark:bg-slate-800">
                    <EuropeMap
                      targetId={question.country.id}
                      selectedId={selected}
                      onSelect={(country) => answer(country)}
                      disabled={Boolean(feedback?.isCorrect)}
                      completedIds={mapRun ? completedIds : []}
                      onZoom={() => setUsedZoom(true)}
                    />
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
            <div className={`mt-6 rounded-lg p-4 ${feedback.isCorrect ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100" : "bg-rose-100 text-rose-900 dark:bg-rose-500/15 dark:text-rose-100"}`} role="status">
              <div className="flex items-center gap-3 font-bold">
                {feedback.isCorrect ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
                <span>
                  {feedback.isCorrect
                    ? `Correct. +${feedback.gained} points`
                    : question.type === "map"
                      ? "Not quite. Try again."
                      : `Not quite. Answer: ${question.answer}`}
                </span>
              </div>
              {question.type === "map" && !feedback.isCorrect && mapWrongAttempts >= 2 && (
                <p className="mt-2 text-sm font-semibold opacity-85">{mapHintFor(question.country)}</p>
              )}
            </div>
          )}
        </Card>
      </section>

      <aside className="space-y-4">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold">Session</h2>
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              aria-label={soundEnabled ? "Mute sound feedback" : "Unmute sound feedback"}
              title={soundEnabled ? "Mute sound feedback" : "Unmute sound feedback"}
            >
              {soundEnabled ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
            </button>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["Score", score],
              ["Correct", correct],
              ["Wrong", wrong],
              ["Accuracy", `${sessionAccuracy}%`],
              ["Streak", streak],
              ["Progress", `${questionNumber}/${questionLimit}`],
              ["Time", formatDuration(elapsedSeconds)],
              ["Attempts", attempts],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
                <dd className="text-2xl font-extrabold">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200">
              <Clock size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-extrabold">Mode Focus</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {focusCopy}
          </p>
        </Card>
      </aside>
    </div>
  );
}
