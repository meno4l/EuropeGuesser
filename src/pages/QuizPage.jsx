import QuizRunner from "../components/QuizRunner";

const copy = {
  capital: ["Capital Guessing Quiz", "Pick the correct capital city for each European country."],
  map: ["Map Guessing Quiz", "Use the SVG map to locate countries by shape and position."],
  flag: ["Flag Quiz", "Study European flags and connect each one to the right country."],
  mixed: ["Mixed Challenge", "A lively rotation of capitals, flags, and map questions."],
};

export default function QuizPage({ mode }) {
  return <QuizRunner mode={mode} title={copy[mode][0]} description={copy[mode][1]} />;
}
