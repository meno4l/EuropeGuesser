import countries from "../data/countries.json";

const shapes = {
  pt: "M72 390 L112 382 L124 446 L84 454 Z",
  es: "M112 360 L218 350 L244 418 L174 470 L88 450 Z",
  fr: "M190 260 L284 250 L316 316 L252 368 L178 342 Z",
  gb: "M142 172 L192 188 L188 248 L138 252 L116 216 Z",
  ie: "M82 190 L120 182 L130 230 L92 242 Z",
  nl: "M238 198 L276 196 L282 232 L244 238 Z",
  be: "M236 234 L276 232 L286 260 L246 266 Z",
  de: "M282 204 L354 198 L376 266 L324 308 L282 268 Z",
  ch: "M272 304 L330 300 L342 332 L286 342 Z",
  it: "M332 330 L374 340 L402 430 L452 488 L418 510 L364 430 L326 382 Z",
  at: "M340 296 L420 292 L440 326 L370 336 Z",
  cz: "M336 260 L400 256 L420 288 L358 296 Z",
  sk: "M408 286 L466 292 L466 320 L414 318 Z",
  hu: "M404 322 L474 318 L492 356 L430 370 Z",
  pl: "M386 208 L486 206 L506 272 L418 286 L374 252 Z",
  dk: "M286 154 L330 150 L342 184 L300 190 Z",
  no: "M294 32 L368 46 L348 146 L286 150 L248 92 Z",
  se: "M376 42 L452 66 L454 162 L390 182 L350 142 Z",
  fi: "M462 52 L548 68 L556 164 L498 182 L454 154 Z",
  ee: "M486 170 L548 170 L552 196 L490 200 Z",
  lv: "M486 202 L558 202 L560 232 L490 238 Z",
  lt: "M482 238 L550 238 L554 270 L490 276 Z",
  ua: "M506 276 L670 288 L684 372 L568 406 L496 356 Z",
  ro: "M478 364 L554 382 L558 436 L488 448 L446 400 Z",
  bg: "M476 430 L568 430 L586 466 L500 482 Z",
  gr: "M444 466 L516 482 L540 544 L480 540 L430 504 Z",
  hr: "M376 356 L442 372 L428 402 L392 392 L358 372 Z",
  rs: "M432 386 L482 392 L492 432 L446 446 L418 414 Z",
  tr: "M564 464 L710 464 L724 514 L596 524 Z",
};

export default function EuropeMap({ targetId, selectedId, onSelect, disabled = false }) {
  return (
    <svg viewBox="40 20 710 550" className="h-auto w-full" role="img" aria-label="Clickable simplified map of Europe">
      <rect x="40" y="20" width="710" height="550" rx="18" fill="currentColor" className="text-sky-100 dark:text-slate-800" />
      {countries.map((country) => {
        const isSelected = selectedId === country.id;
        const isTarget = targetId === country.id;
        const showTarget = selectedId && isTarget;
        const fill = isSelected || showTarget ? (isTarget ? "#10b981" : "#f43f5e") : undefined;

        return (
          <path
            key={country.id}
            d={shapes[country.id]}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-label={country.name}
            onClick={() => !disabled && onSelect(country)}
            onKeyDown={(event) => {
              if (!disabled && (event.key === "Enter" || event.key === " ")) onSelect(country);
            }}
            className={`map-country stroke-slate-400 dark:stroke-slate-950 ${fill ? "" : "fill-white dark:fill-slate-700"}`}
            fill={fill}
            strokeWidth="1.5"
          />
        );
      })}
      {countries.map((country) => (
        <text key={`${country.id}-label`} x={country.x} y={country.y} textAnchor="middle" className="pointer-events-none fill-slate-600 text-[11px] font-bold dark:fill-slate-200">
          {country.id.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}
