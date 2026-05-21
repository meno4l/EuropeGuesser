import { useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { geoCentroid, geoConicConformal, geoGraticule, geoPath } from "d3-geo";
import { feature as topoFeature } from "topojson-client";
import world from "world-atlas/countries-50m.json";
import countries from "../data/countries.json";

const width = 760;
const height = 620;
const mapInset = 24;
const viewAspect = width / height;
const defaultViewWidth = 540;
const defaultViewHeight = defaultViewWidth / viewAspect;
const defaultViewport = {
  x: 190,
  y: 96,
  width: defaultViewWidth,
  height: defaultViewHeight,
};
const minViewWidth = 42;
const maxViewWidth = width;

const mapIdByCountryId = {
  ad: "020",
  al: "008",
  am: "051",
  at: "040",
  az: "031",
  ba: "070",
  be: "056",
  bg: "100",
  by: "112",
  ch: "756",
  cy: "196",
  cz: "203",
  de: "276",
  dk: "208",
  ee: "233",
  es: "724",
  fi: "246",
  fr: "250",
  gb: "826",
  ge: "268",
  gr: "300",
  hr: "191",
  hu: "348",
  ie: "372",
  is: "352",
  it: "380",
  li: "438",
  lt: "440",
  lu: "442",
  lv: "428",
  mc: "492",
  md: "498",
  me: "499",
  mk: "807",
  mt: "470",
  nl: "528",
  no: "578",
  pl: "616",
  pt: "620",
  ro: "642",
  ru: "643",
  rs: "688",
  si: "705",
  sm: "674",
  se: "752",
  sk: "703",
  tr: "792",
  ua: "804",
  va: "336",
};

const mapNameByCountryId = {
  xk: "Kosovo",
};

const microCountryIds = new Set(["ad", "li", "lu", "mc", "mt", "sm", "va"]);

const countryById = new Map(countries.map((country) => [country.id, country]));
const countryIdByMapId = new Map(Object.entries(mapIdByCountryId).map(([countryId, mapId]) => [mapId, countryId]));
const countryIdByMapName = new Map(Object.entries(mapNameByCountryId).map(([countryId, name]) => [name, countryId]));
const worldFeatures = topoFeature(world, world.objects.countries).features;
const europeFrame = {
  type: "Feature",
  geometry: {
    type: "MultiPoint",
    coordinates: [
      [-14, 25],
      [70, 75],
    ],
  },
};

const projection = geoConicConformal()
  .parallels([35, 65])
  .rotate([-15, 0])
  .fitExtent(
    [
      [mapInset, mapInset],
      [width - mapInset, height - mapInset],
    ],
    europeFrame,
  )
  .clipExtent([
    [0, 0],
    [width, height],
  ]);

const path = geoPath(projection);
const graticule = geoGraticule().extent([
  [-14, 25],
  [70, 75],
]);

function countryIdForFeature(geoFeature) {
  return countryIdByMapId.get(geoFeature.id) || countryIdByMapName.get(geoFeature.properties.name);
}

const quizFeatures = worldFeatures
  .map((geoFeature) => ({
    country: countryById.get(countryIdForFeature(geoFeature)),
    geoFeature,
  }))
  .filter(({ country }) => country)
  .sort((a, b) => a.country.name.localeCompare(b.country.name));

const microFeatures = quizFeatures.filter(({ country }) => microCountryIds.has(country.id));

const contextFeatures = worldFeatures.filter((geoFeature) => {
  if (countryIdForFeature(geoFeature)) return false;
  const [longitude, latitude] = geoCentroid(geoFeature);
  return longitude >= -16 && longitude <= 72 && latitude >= 25 && latitude <= 75;
});

const countryTone = {
  default: "fill-white stroke-slate-400/90 hover:fill-emerald-50 dark:fill-slate-600 dark:stroke-slate-950 dark:hover:fill-emerald-900/60",
  complete: "fill-emerald-100 stroke-emerald-500/80 hover:fill-emerald-200 dark:fill-emerald-900/45 dark:stroke-emerald-400/70 dark:hover:fill-emerald-900/70",
  correct: "fill-emerald-400 stroke-emerald-950 dark:fill-emerald-500 dark:stroke-emerald-100",
  highlight: "fill-amber-300 stroke-amber-800 dark:fill-amber-400 dark:stroke-amber-100",
  wrong: "fill-rose-400 stroke-rose-950 dark:fill-rose-500 dark:stroke-rose-100",
};

const microTone = {
  default: "fill-slate-700 stroke-white dark:fill-slate-100 dark:stroke-slate-950",
  complete: "fill-emerald-600 stroke-white dark:fill-emerald-300 dark:stroke-slate-950",
  correct: "fill-emerald-500 stroke-emerald-950 dark:stroke-emerald-100",
  highlight: "fill-amber-400 stroke-amber-900 dark:stroke-amber-100",
  wrong: "fill-rose-500 stroke-rose-950 dark:stroke-rose-100",
};

function clampViewport(viewport) {
  const nextWidth = Math.min(Math.max(viewport.width, minViewWidth), maxViewWidth);
  const nextHeight = nextWidth / viewAspect;

  return {
    x: Math.min(Math.max(viewport.x, 0), width - nextWidth),
    y: Math.min(Math.max(viewport.y, 0), height - nextHeight),
    width: nextWidth,
    height: nextHeight,
  };
}

function countryStatus(countryId, targetId, selectedId, highlightIds, completedIds) {
  const isSelected = selectedId === countryId;
  const isTarget = targetId === countryId;

  if (isSelected && isTarget) return "correct";
  if (isSelected) return "wrong";
  if (highlightIds.includes(countryId)) return "highlight";
  if (completedIds.has(countryId)) return "complete";
  return "default";
}

export default function EuropeMap({
  targetId,
  selectedId,
  onSelect,
  onZoom,
  disabled = false,
  highlightIds = [],
  completedIds = [],
  className = "",
}) {
  const mapId = useId().replace(/:/g, "");
  const clipId = `${mapId}-clip`;
  const waterId = `${mapId}-water`;
  const activeHighlightIds = Array.isArray(highlightIds) ? highlightIds : [];
  const activeCompletedIds = new Set(Array.isArray(completedIds) ? completedIds : []);
  const canSelect = !disabled && typeof onSelect === "function";
  const [viewport, setViewport] = useState(defaultViewport);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);

  function handlePointerDown(event) {
    if (event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const countryElement = event.target instanceof Element ? event.target.closest("[data-country-id]") : null;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startViewport: viewport,
      screenWidth: bounds.width,
      screenHeight: bounds.height,
      countryId: countryElement?.dataset.countryId,
      moved: false,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      drag.moved = true;
      suppressClickRef.current = true;
    }

    const scaleX = drag.startViewport.width / drag.screenWidth;
    const scaleY = drag.startViewport.height / drag.screenHeight;
    setViewport(
      clampViewport({
        ...drag.startViewport,
        x: drag.startViewport.x - deltaX * scaleX,
        y: drag.startViewport.y - deltaY * scaleY,
      }),
    );
  }

  function handleWheel(event) {
    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;
    const mapX = viewport.x + pointerX * viewport.width;
    const mapY = viewport.y + pointerY * viewport.height;
    const zoomFactor = event.deltaY < 0 ? 0.84 : 1.19;
    const nextWidth = viewport.width * zoomFactor;
    const nextHeight = nextWidth / viewAspect;

    onZoom?.();
    setViewport(
      clampViewport({
        x: mapX - pointerX * nextWidth,
        y: mapY - pointerY * nextHeight,
        width: nextWidth,
        height: nextHeight,
      }),
    );
  }

  function finishDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!drag.moved && canSelect && drag.countryId) {
      const country = countryById.get(drag.countryId);
      if (country) onSelect(country);
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      return;
    }

    if (drag.moved) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }

  function handleClickCapture(event) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  }

  function resetViewport() {
    dragRef.current = null;
    suppressClickRef.current = false;
    setIsDragging(false);
    setViewport(defaultViewport);
  }

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        onClick={resetViewport}
        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-lg border border-white/75 bg-white/90 text-slate-700 shadow-soft backdrop-blur transition hover:bg-white hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950/85 dark:text-slate-100 dark:hover:text-emerald-300"
        aria-label="Reset map view"
        title="Reset map view"
      >
        <RotateCcw size={18} aria-hidden="true" />
      </button>
      <svg
        viewBox={`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`}
        className={`map-surface h-auto w-full rounded-lg ${isDragging ? "is-dragging" : ""}`}
        role="img"
        aria-label="Draggable clickable map of Europe"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onWheel={handleWheel}
        onClickCapture={handleClickCapture}
      >
        <defs>
          <linearGradient id={waterId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#dff7fb" />
            <stop offset="52%" stopColor="#c7edf4" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={width} height={height} rx="24" />
          </clipPath>
        </defs>

        <rect x="0" y="0" width={width} height={height} rx="24" fill={`url(#${waterId})`} className="dark:fill-slate-900" />

        <g clipPath={`url(#${clipId})`}>
          <path d={path(graticule())} className="fill-none stroke-white/70 dark:stroke-white/10" strokeWidth="0.85" />

          {contextFeatures.map((geoFeature) => (
            <path
              key={geoFeature.id}
              d={path(geoFeature)}
              className="fill-white/40 stroke-white/70 dark:fill-slate-700/45 dark:stroke-slate-950/70"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {quizFeatures.map(({ country, geoFeature }) => {
            const status = countryStatus(country.id, targetId, selectedId, activeHighlightIds, activeCompletedIds);

            return (
              <path
                key={country.id}
                data-country-id={country.id}
                d={path(geoFeature)}
                tabIndex={canSelect ? 0 : -1}
                role={canSelect ? "button" : undefined}
                aria-label={country.name}
                aria-disabled={!canSelect}
                onKeyDown={(event) => {
                  if (!canSelect || (event.key !== "Enter" && event.key !== " ")) return;
                  event.preventDefault();
                  onSelect(country);
                }}
                className={`map-country ${countryTone[status]}`}
                strokeWidth={status === "default" ? 0.85 : 1.35}
                vectorEffect="non-scaling-stroke"
              >
                <title>{country.name}</title>
              </path>
            );
          })}

          {microFeatures.map(({ country, geoFeature }) => {
            const [x, y] = path.centroid(geoFeature);
            const status = countryStatus(country.id, targetId, selectedId, activeHighlightIds, activeCompletedIds);
            if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

            return (
              <g key={`${country.id}-target`} data-country-id={country.id} className="map-micro-target" aria-label={country.name}>
                <circle className="map-micro-hit fill-transparent" cx={x} cy={y} r="11" />
                <circle className={`map-micro-dot ${microTone[status]}`} cx={x} cy={y} r="4.25" strokeWidth="1.3" vectorEffect="non-scaling-stroke">
                  <title>{country.name}</title>
                </circle>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
