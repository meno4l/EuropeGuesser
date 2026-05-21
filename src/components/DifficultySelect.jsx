export default function DifficultySelect({ value, onChange }) {
  return (
    <div className="inline-flex rounded-lg bg-slate-200 p-1 dark:bg-slate-800" role="group" aria-label="Difficulty">
      {["easy", "medium", "hard"].map((difficulty) => (
        <button
          key={difficulty}
          type="button"
          onClick={() => onChange(difficulty)}
          className={`rounded-md px-3 py-2 text-sm font-bold capitalize transition ${
            value === difficulty ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-600 hover:text-slate-950 dark:text-slate-300"
          }`}
        >
          {difficulty}
        </button>
      ))}
    </div>
  );
}
