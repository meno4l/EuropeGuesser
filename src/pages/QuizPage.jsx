import { Navigate, useLocation, useParams } from "react-router-dom";
import QuizRunner from "../components/QuizRunner";
import countries from "../data/countries.json";
import { practiceRegionById } from "../data/practiceRegions";

const copy = {
  capital: ["Capital Guessing Quiz", "Pick the correct capital city for each European country."],
  countries: ["Europe Country Run", "Find every country in Europe on the map. Each country appears once."],
  flag: ["Flag Quiz", "Study European flags and connect each one to the right country."],
  mixed: ["Mixed Challenge", "A lively rotation of capitals, flags, and map questions."],
};

export default function QuizPage({ mode }) {
  const location = useLocation();
  const { regionId } = useParams();

  if (mode === "region") {
    const region = practiceRegionById[regionId];
    if (!region) return <Navigate to="/dashboard" replace />;

    const pool = region.countryIds.map((countryId) => countries.find((country) => country.id === countryId)).filter(Boolean);

    return (
      <QuizRunner
        key={`${mode}-${region.id}-${location.key}`}
        mode={mode}
        regionId={region.id}
        pool={pool}
        title={region.title}
        description={region.description}
      />
    );
  }

  return <QuizRunner key={`${mode}-${location.key}`} mode={mode} title={copy[mode][0]} description={copy[mode][1]} />;
}
