import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { accuracyFor, defaultProfile, loadProfile, loadTheme, saveProfile, saveTheme } from "../utils/storage";

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
        const achievements = new Set(current.achievements);

        if (result.score >= 80) achievements.add("Sharp Explorer");
        if (result.bestStreak >= 5) achievements.add("Streak Scholar");
        if (correctAnswers >= 25) achievements.add("Europe Regular");

        return {
          ...current,
          totalScore,
          correctAnswers,
          wrongAnswers,
          bestStreak,
          quizzesPlayed: current.quizzesPlayed + 1,
          highScore: Math.max(current.highScore, result.score),
          achievements: Array.from(achievements),
        };
      });
    }

    function resetProfile() {
      setProfile(defaultProfile);
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
