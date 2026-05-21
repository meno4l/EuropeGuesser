import countries from "../data/countries.json";

export const countryPool = countries;

export function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function pickOptions(correct, field, pool, count = 4) {
  const distractors = shuffle(pool.filter((item) => item.id !== correct.id)).slice(0, count - 1);
  return shuffle([correct, ...distractors]).map((item) => ({
    id: item.id,
    label: item[field],
    country: item,
  }));
}

export function makeCapitalQuestion(pool) {
  const country = shuffle(pool)[0];
  return {
    type: "capital",
    prompt: `What is the capital of ${country.name}?`,
    country,
    answer: country.capital,
    options: pickOptions(country, "capital", pool),
  };
}

export function makeFlagQuestion(pool) {
  const country = shuffle(pool)[0];
  return {
    type: "flag",
    prompt: "Which country uses this flag?",
    country,
    answer: country.name,
    options: pickOptions(country, "name", pool),
  };
}

export function makeMapQuestion(pool) {
  const country = shuffle(pool)[0];
  return makeCountryQuestion(country);
}

export function makeCountryQuestion(country) {
  return {
    type: "map",
    prompt: `Click ${country.name} on the map.`,
    country,
    answer: country.name,
    options: [],
  };
}

export function makeQuestion(mode, pool) {
  if (mode === "capital") return makeCapitalQuestion(pool);
  if (mode === "flag") return makeFlagQuestion(pool);
  if (mode === "map") return makeMapQuestion(pool);
  return [makeCapitalQuestion, makeFlagQuestion, makeMapQuestion][Math.floor(Math.random() * 3)](pool);
}

export function scoreAnswer(isCorrect, streak) {
  if (!isCorrect) return 0;
  return 10 + Math.min(streak, 5) * 2;
}
