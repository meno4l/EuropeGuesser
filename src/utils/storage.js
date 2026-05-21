const STORAGE_KEY = "europeGuesserProfile";
const THEME_KEY = "europeGuesserTheme";

export const defaultProfile = {
  name: "",
  totalScore: 0,
  highScore: 0,
  quizzesPlayed: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  bestStreak: 0,
  achievements: [],
};

export function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function accuracyFor(profile) {
  const total = profile.correctAnswers + profile.wrongAnswers;
  return total ? Math.round((profile.correctAnswers / total) * 100) : 0;
}
