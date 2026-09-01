import { useState, useCallback, useRef, useEffect } from "react";
import censusDemo from "../../data/census-demographics.json";
import censusDates from "../../modules/dates/data/census-dates.json";
import { buildOutlinePath, projectStates, VIEW_BOX } from "./geo.js";

const MAP_STATES = projectStates(
  Object.entries(censusDemo.states).map(([id, d]) => {
    const cn = censusDates.states.find((s) => s.id === id);
    return { id, ...d, phaseI: cn?.phaseI, phaseII: cn?.phaseII };
  })
);

const LAYERS = [
  { id: "density", label: "Population Density", dot: "var(--color-terracotta)" },
  { id: "literacy", label: "Literacy Spread", dot: "var(--color-sage)" },
  { id: "urban", label: "Urban vs Rural", dot: "var(--color-dusty)" },
];

const LEGENDS = {
  density: [
    { label: ">100M", color: "var(--color-terracotta)" },
    { label: "50-100M", color: "rgba(217,107,67,.6)" },
    { label: "10-50M", color: "rgba(217,107,67,.35)" },
    { label: "<10M", color: "rgba(217,107,67,.18)" },
  ],
  literacy: [
    { label: ">85%", color: "var(--color-sage)" },
    { label: "75-85%", color: "rgba(110,139,122,.6)" },
    { label: "65-75%", color: "rgba(110,139,122,.35)" },
    { label: "<65%", color: "rgba(110,139,122,.18)" },
  ],
  urban: [
    { label: ">45%", color: "var(--color-dusty)" },
    { label: "30-45%", color: "rgba(92,124,138,.6)" },
    { label: "15-30%", color: "rgba(92,124,138,.35)" },
    { label: "<15%", color: "rgba(92,124,138,.18)" },
  ],
};

function getPopRadius(pop) {
  if (pop > 100_000_000) return 15;
  if (pop > 50_000_000) return 12;
  if (pop > 20_000_000) return 9;
  if (pop > 10_000_000) return 7;
  return 5.5;
}

function getLiteracyColor(lit) {
  if (lit > 85) return "var(--color-sage)";
  if (lit > 75) return "rgba(110,139,122,.65)";
  if (lit > 65) return "rgba(110,139,122,.4)";
  return "rgba(110,139,122,.2)";
}

function getUrbanColor(urban) {
  if (urban > 45) return "var(--color-dusty)";
  if (urban > 30) return "rgba(92,124,138,.6)";
  if (urban > 15) return "rgba(92,124,138,.35)";
  return "rgba(92,124,138,.18)";
}

function getDensityColor(pop) {
  if (pop > 100_000_000) return "var(--color-terracotta)";
  if (pop > 50_000_000) return "rgba(217,107,67,.6)";
  if (pop > 20_000_000) return "rgba(217,107,67,.35)";
  return "rgba(217,107,67,.2)";
}

function getStateColor(state, layer) {
  if (layer === "density") return getDensityColor(state.population);
  if (layer === "literacy") return getLiteracyColor(state.literacy);
  return getUrbanColor(state.urbanShare);
}

function getStateRadius(state, layer) {
  if (layer === "density") return getPopRadius(state.population);
  if (layer === "literacy") return 4 + (state.literacy / 100) * 8;
  return 4 + (state.urbanShare / 100) * 8;
}

const TIMELINE_YEARS = [1991, 1996, 2001, 2006, 2011, 2016, 2021, 2026];

export default function MapCanvas({ selectedState, onStateSelect }) {
  const [activeLayer, setActiveLayer] = useState("density");
  const [year, setYear] = useState(2026);
  const [playing, setPlaying] = useState(false);
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef(null);

  const yearIdx = TIMELINE_YEARS.indexOf(year);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setYear((prev) => {
        const idx = TIMELINE_YEARS.indexOf(prev);
        if (idx >= TIMELINE_YEARS.length - 1) {
          setPlaying(false);
          return prev;
        }
        return TIMELINE_YEARS[idx + 1];
      });
    }, 900);
    return () => clearInterval(timerRef.current);
  }, [playing]);

  const hovered = hoveredState ? MAP_STATES.find((s) => s.id === hoveredState) : null;
  const sel = selectedState ? MAP_STATES.find((s) => s.id === selectedState) : null;

  const handleMouseOver = useCallback((e, id) => {
    setHoveredState(id);
    const rect = e.currentTarget.closest(".map-canvas").getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left + 14, y: e.clientY - rect.top - 14 });
  }, []);

  const outlinePath = buildOutlinePath();

  return (
    <div className="split-card map-workspace animate-fade-up">
      {/* Head */}
      <div className="map-head">
        <span style={{ fontSize: "1.1rem" }} aria-hidden="true">
          🗺️
        </span>
        <span className="map-title">Geospatial Canvas</span>
        <span className="map-region-chip">{year}</span>
        <span style={{ marginLeft: "auto", fontSize: ".68rem", color: "var(--color-ink-4-light)" }}>
          {sel ? sel.name : "Hover or tap a state"}
        </span>
      </div>

      <div
        className="map-canvas"
        role="img"
        aria-label="Interactive India map showing census demographics"
      >
        <svg
          className="map-svg"
          viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          aria-hidden="true"
        >
          {/* India outline — geographically projected */}
          <path
            d={outlinePath}
            fill="rgba(92,124,138,.07)"
            stroke="rgba(92,124,138,.5)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Longitude guide lines */}
          {[70, 80, 90].map((lon) => (
            <line
              key={lon}
              x1={((lon - 68) / 29) * (VIEW_BOX.width - 80) + 40}
              y1="20"
              x2={((lon - 68) / 29) * (VIEW_BOX.width - 80) + 40}
              y2={VIEW_BOX.height - 20}
              stroke="rgba(24,24,27,.05)"
              strokeWidth=".8"
              strokeDasharray="4 6"
            />
          ))}

          {/* State dots */}
          {MAP_STATES.map((s) => {
            const r = getStateRadius(s, activeLayer) * (year >= 2016 ? 1 : 0.92);
            const fill = getStateColor(s, activeLayer);
            const isSelected = selectedState === s.id;
            const isHovered = hoveredState === s.id;

            return (
              <g key={s.id}>
                <circle
                  cx={s.pos.x}
                  cy={s.pos.y}
                  r={r}
                  fill={isSelected ? "var(--color-amber)" : fill}
                  stroke={
                    isSelected
                      ? "var(--color-amber)"
                      : isHovered
                        ? "var(--color-terracotta)"
                        : "transparent"
                  }
                  strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 0}
                  opacity={isSelected ? 1 : isHovered ? 0.95 : 0.82}
                  style={{ cursor: "pointer", transition: "all .2s ease" }}
                  onMouseEnter={(e) => handleMouseOver(e, s.id)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => onStateSelect?.(selectedState === s.id ? null : s.id)}
                  role="button"
                  aria-label={`${s.name} — Population: ${formatK(s.population)}, Literacy: ${s.literacy}%`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onStateSelect?.(selectedState === s.id ? null : s.id);
                  }}
                />
                {r >= 7 && (
                  <text
                    x={s.pos.x}
                    y={s.pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={r > 11 ? 7.5 : 6}
                    fontWeight="600"
                    fontFamily="var(--font-display)"
                    style={{ pointerEvents: "none" }}
                  >
                    {s.id}
                  </text>
                )}
              </g>
            );
          })}

          {/* Hover tooltip (in-canvas) */}
          {hovered && (
            <g style={{ pointerEvents: "none" }}>
              <rect
                x={tooltipPos.x - 4}
                y={tooltipPos.y - 34}
                width={136}
                height={40}
                rx={8}
                fill="rgba(255,255,255,.97)"
                stroke="rgba(0,0,0,.12)"
                strokeWidth=".8"
              />
              <text
                x={tooltipPos.x + 5}
                y={tooltipPos.y - 18}
                fontSize="8"
                fontWeight="600"
                fill="#141414"
                fontFamily="var(--font-display)"
              >
                {hovered.name}
              </text>
              <text
                x={tooltipPos.x + 5}
                y={tooltipPos.y - 6}
                fontSize="6.5"
                fill="#6F7680"
                fontFamily="var(--font-sans)"
              >
                Pop: {formatK(hovered.population)} · Lit: {hovered.literacy}%
              </text>
            </g>
          )}
        </svg>

        {/* Layer dock */}
        <div className="map-layer-dock">
          <div className="layer-group">
            <div className="layer-title">Layers</div>
            {LAYERS.map((l) => (
              <button
                key={l.id}
                className={`layer-btn${activeLayer === l.id ? " active" : ""}`}
                onClick={() => setActiveLayer(l.id)}
              >
                <span className="layer-dot" style={{ background: l.dot }} />
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <div className="legend-title">{LAYERS.find((l) => l.id === activeLayer)?.label}</div>
          {LEGENDS[activeLayer]?.map((item, i) => (
            <div key={i} className="legend-item">
              <span className="legend-swatch" style={{ background: item.color }} />
              {item.label}
            </div>
          ))}
        </div>

        {/* Info overlay */}
        <div className="map-info">
          <div className="map-info-title">Selected State</div>
          {sel ? (
            <>
              <div className="map-info-row">
                <span className="map-info-label">Population</span>
                <span className="map-info-val">{formatK(sel.population)}</span>
              </div>
              <div className="map-info-row">
                <span className="map-info-label">Literacy</span>
                <span className="map-info-val">{sel.literacy}%</span>
              </div>
              <div className="map-info-row">
                <span className="map-info-label">Sex Ratio</span>
                <span className="map-info-val">{sel.sexRatio}</span>
              </div>
              <div className="map-info-row">
                <span className="map-info-label">Urban</span>
                <span className="map-info-val">{sel.urbanShare}%</span>
              </div>
            </>
          ) : (
            <div
              style={{ fontSize: ".72rem", color: "var(--color-ink-4-light)", padding: ".3rem 0" }}
            >
              Click a state to inspect
            </div>
          )}
        </div>
      </div>

      {/* Timeline scrubber */}
      <div className="map-timeline">
        <button
          className="timeline-play"
          onClick={() => {
            if (year >= 2026) {
              setYear(1991);
              setPlaying(true);
            } else setPlaying((v) => !v);
          }}
          aria-label={playing ? "Pause timeline" : "Play timeline"}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="1.5" width="3" height="9" rx="1" fill="currentColor" />
              <rect x="7" y="1.5" width="3" height="9" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 1l9 5-9 5V1z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div className="timeline-track">
          <div className="timeline-labels">
            {TIMELINE_YEARS.map((y) => (
              <span
                key={y}
                style={{
                  opacity: y === year ? 1 : 0.5,
                  fontWeight: y === year ? 600 : 400,
                }}
              >
                {y}
              </span>
            ))}
          </div>
          <input
            type="range"
            className="timeline-slider"
            min={0}
            max={TIMELINE_YEARS.length - 1}
            step={1}
            value={yearIdx >= 0 ? yearIdx : TIMELINE_YEARS.length - 1}
            onChange={(e) => {
              setPlaying(false);
              setYear(TIMELINE_YEARS[Number(e.target.value)]);
            }}
            aria-label="Census timeline year"
          />
        </div>

        <span className="timeline-year">{year}</span>
      </div>
    </div>
  );
}

function formatK(val) {
  if (val >= 1e9) return (val / 1e9).toFixed(2) + "B";
  if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
  if (val >= 1e3) return (val / 1e3).toFixed(0) + "K";
  return String(val);
}
