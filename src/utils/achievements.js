export function achievementsForResult(result, totals = {}) {
  const achievements = [];
  const questionLimit = result.questionLimit || 0;
  const completedRun = questionLimit > 0 && result.correct >= questionLimit;
  const perfectRun = completedRun && result.wrong === 0;

  if (result.score >= 80) achievements.push("Sharp Explorer");
  if (result.bestStreak >= 5) achievements.push("Streak Scholar");
  if (result.bestStreak >= 10) achievements.push("10 in a Row");
  if ((totals.correctAnswers || 0) >= 25) achievements.push("Europe Regular");
  if (perfectRun) achievements.push("Perfect Run");
  if (result.regionId === "microstates" && completedRun) achievements.push("Microstate Master");
  if (result.isMapRun && completedRun && !result.usedZoom) achievements.push("No-Zoom Win");

  return achievements;
}
