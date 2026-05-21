import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { accuracyFor, defaultProfile, loadProfile, loadTheme, saveProfile, saveTheme } from "../utils/storage";
import { achievementsForResult } from "../utils/achievements";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile);
  const [theme, setThemeState] = useState(loadTheme);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    saveTheme(theme);
  }, [theme]);

  const value = useMemo(() => {
    function createPlayer(name) {
      setProfile({ ...defaultProfile, name: name.trim() });
    }

    function completeQuiz(result) {
      setProfile((current) => {
        const totalScore = current.totalScore + result.score;
        const correctAnswers = current.correctAnswers + result.correct;
        const wrongAnswers = current.wrongAnswers + result.wrong;
        const bestStreak = Math.max(current.bestStreak, result.bestStreak);
        const durationSeconds = Number.isFinite(result.durationSeconds) ? result.durationSeconds : null;
        const completedRun = (result.questionLimit || 0) > 0 && result.correct >= result.questionLimit;
        const bestRegionTimes = { ...(current.bestRegionTimes || {}) };
        let fastestEuropeRunSeconds = current.fastestEuropeRunSeconds ?? null;
        const achievements = new Set(current.achievements);

        if (durationSeconds !== null && result.regionId && completedRun) {
          bestRegionTimes[result.regionId] =
            bestRegionTimes[result.regionId] == null ? durationSeconds : Math.min(bestRegionTimes[result.regionId], durationSeconds);
        }

        if (durationSeconds !== null && result.mode === "countries" && completedRun) {
          fastestEuropeRunSeconds =
            fastestEuropeRunSeconds == null ? durationSeconds : Math.min(fastestEuropeRunSeconds, durationSeconds);
        }

        achievementsForResult(result, { correctAnswers }).forEach((achievement) => achievements.add(achievement));

        return {
          ...current,
          totalScore,
          correctAnswers,
          wrongAnswers,
          bestStreak,
          quizzesPlayed: current.quizzesPlayed + 1,
          highScore: Math.max(current.highScore, result.score),
          fastestEuropeRunSeconds,
          bestRegionTimes,
          achievements: Array.from(achievements),
        };
      });
    }

    function resetProfile() {
      setProfile((current) => ({ ...defaultProfile, name: current.name }));
    }

    function setTheme(nextTheme) {
      setThemeState(nextTheme);
    }

    return {
      profile,
      theme,
      accuracy: accuracyFor(profile),
      createPlayer,
      completeQuiz,
      resetProfile,
      setTheme,
    };
  }, [profile, theme]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider");
  return context;
}
