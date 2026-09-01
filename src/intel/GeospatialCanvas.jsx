import { useRef, useState, useCallback } from "react";
import { Layers, Play, Pause, ChevronLeft, ChevronRight, Crosshair } from "lucide-react";
import { STATES, DISTRICTS, MAP_LAYERS, TIMELINE } from "./data.js";
import { outlinePath, stateShape, centroid, MIGRATION_LINES, VIEW_W, VIEW_H } from "./geo.js";
import CursorHUD from "./CursorHUD.jsx";
import { formatPopulation } from "./utils.js";

// ────────────────────────────────────────────────────────────
// Geospatial Canvas — SV-vector map of India with interactive
// mouse layer, crosshairs, layer controller and time scrubber.
// ────────────────────────────────────────────────────────────
export default function GeospatialCanvas({
  viewMode,
  layer,
  onLayerChange,
  activeRegion,
  onSelectRegion,
  onHoverRegion,
}) {
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null); // { region, density, margin, ratio }
  const [mouse, setMouse] = useState(null);
  const [cross, setCross] = useState(null); // { x, y } in viewBox coords
  const [year, setYear] = useState(2011);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef(null);

  const yearIndex = TIMELINE.indexOf(year);

  const activeOrDefault = useCallback((state) => {
    const dists = DISTRICTS[state.id];
    return dists ? dists[0].density : state.density;
  }, []);

  const densityFn = useCallback(
    (state, y) => {
      if (viewMode === "district") return activeOrDefault(state);
      const base = state.density;
      return Math.round(base * (0.82 + ((y - 1991) / 35) * 0.18));
    },
    [viewMode, activeOrDefault]
  );

  const handleMove = useCallback(
    (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const parent = el.firstElementChild?.nextElementSibling; // map body
      const rect = parent ? parent.getBoundingClientRect() : el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setMouse({ x: px, y: py, parentW: rect.width, parentH: rect.height });

      // translate pixel -> viewBox coords under xMidYMid meet scaling
      const scale = Math.min(rect.width / VIEW_W, rect.height / VIEW_H);
      const offX = (rect.width - VIEW_W * scale) / 2;
      const offY = (rect.height - VIEW_H * scale) / 2;
      const vx = (px - offX) / scale;
      const vy = (py - offY) / scale;
      setCross({ x: vx, y: vy });

      // hit test nearest state centroid in viewBox space
      let best = null;
      let bestD = 30;
      for (const s of STATES) {
        const [cx, cy] = centroid(s.id);
        const d = Math.hypot(vx - cx, vy - cy);
        if (d < bestD) {
          bestD = d;
          best = s;
        }
      }
      if (best)
        setHover({
          region: best.name,
          density: densityFn(best, year),
          margin: best.margin,
          ratio: `${best.sexRatio}:1k`,
        });
      else setHover(null);
    },
    [densityFn, year]
  );

  const handleLeave = useCallback(() => {
    setHover(null);
    setCross(null);
    setMouse(null);
    onHoverRegion?.(null);
  }, [onHoverRegion]);

  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false);
      clearInterval(playRef.current);
      return;
    }
    setPlaying(true);
    playRef.current = setInterval(() => {
      setYear((y) => {
        const i = TIMELINE.indexOf(y);
        const next = TIMELINE[(i + 1) % TIMELINE.length];
        return next;
      });
    }, 900);
  }, [playing]);

  const vbW = VIEW_W;
  const vbH = VIEW_H;

  const colorFor = useCallback(
    (state) => {
      if (activeRegion === state.id) return "#E5A95D";
      const d = densityFn(state, year);
      const ratio = d / 21000; // density color scale
      if (ratio > 0.5) return "#E06D53";
      if (ratio > 0.12) return "#E06D53cc";
      if (ratio > 0.04) return "#7D9D8B";
      return "#3B4A5A";
    },
    [activeRegion, densityFn, year]
  );

  return (
    <div
      ref={wrapRef}
      className="relative flex flex-col rounded-md border border-slate-800/80 bg-[#0A0D14] overflow-hidden"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* top bar */}
      <div className="flex items-center gap-2 px-3 h-9 border-b border-slate-800/80 bg-[#0F141F]">
        <Layers className="w-3.5 h-3.5 text-slate-500 mr-1" />
        <div className="flex items-center gap-1">
          {MAP_LAYERS.map((l) => (
            <button
              key={l.id}
              onClick={() => onLayerChange(l.id)}
              className={`px-2 h-6 rounded text-[10.5px] font-medium transition-colors ${
                layer === l.id
                  ? "bg-slate-800 text-slate-100 border border-slate-700/60"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 font-mono text-[10px] text-slate-600">
          <Crosshair className="w-3 h-3" />
          {cross ? `${Math.round(cross.x)}, ${Math.round(cross.y)}` : "—, —"}
        </div>
      </div>

      {/* map body */}
      <div className="relative flex-1 min-h-[380px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#111725,transparent_75%)]" />
        {/* graticule */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${vbW} ${vbH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g stroke="#182033" strokeWidth="0.5">
            {[...Array(5)].map((_, i) => {
              const x = 40 + i * 115;
              return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={vbH} />;
            })}
            {[...Array(5)].map((_, i) => {
              const y = 40 + i * 115;
              return <line key={`h${i}`} x1={0} y1={y} x2={vbW} y2={y} />;
            })}
          </g>
        </svg>

        {/* states svg */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${vbW} ${vbH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {MIGRATION_LINES.map((l, i) => {
            const [fx, fy] = centroid(l.from);
            const [tx, ty] = centroid(l.to);
            const migrationMode = layer === "migration";
            return (
              <g key={i}>
                <line
                  x1={fx}
                  y1={fy}
                  x2={tx}
                  y2={ty}
                  stroke="#6B8DA6"
                  strokeWidth={migrationMode ? 1.4 : 0.5}
                  strokeDasharray={migrationMode ? "5 3" : "3 3"}
                  opacity={migrationMode ? 0.85 : 0.4}
                />
                <circle
                  cx={tx}
                  cy={ty}
                  r={migrationMode ? 2.4 : 1.4}
                  fill="#6B8DA6"
                  opacity="0.85"
                />
              </g>
            );
          })}

          {STATES.map((s) => (
            <g key={s.id}>
              <path
                d={stateShape(s.id, layer)}
                fill={colorFor(s)}
                fillOpacity="0.82"
                stroke={activeRegion === s.id ? "#E5A95D" : "#0A0D14"}
                strokeWidth={activeRegion === s.id ? 1.8 : 0.9}
                className="cursor-pointer transition-[fill-opacity] hover:fill-opacity-100"
                onMouseEnter={() => onHoverRegion?.(s.id)}
                onClick={() => onSelectRegion(s.id)}
              >
                <title>{`${s.name} — ${formatPopulation(s.population)}`}</title>
              </path>
              {(layer === "hexbin" || layer === "choropleth") && (
                <text
                  x={centroid(s.id)[0]}
                  y={centroid(s.id)[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fontFamily="ui-monospace,monospace"
                  fill={activeRegion === s.id ? "#0A0D14" : "#0A0D14"}
                  className="pointer-events-none select-none"
                >
                  {s.id}
                </text>
              )}
            </g>
          ))}

          {/* outline */}
          <path
            d={outlinePath()}
            fill="none"
            stroke="#2C3A4D"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />

          {/* magnetic crosshairs */}
          {cross && (
            <g
              stroke="#6B8DA6"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              opacity="0.6"
              pointerEvents="none"
            >
              <line x1={cross.x} y1={0} x2={cross.x} y2={VIEW_H} />
              <line x1={0} y1={cross.y} x2={VIEW_W} y2={cross.y} />
            </g>
          )}
        </svg>

        {/* legend */}
        <div className="absolute bottom-4 left-3 z-10 rounded-md border border-slate-800 bg-[#0F141F]/92 px-2.5 py-1.5 font-mono text-[9px] text-slate-400">
          <div className="mb-1 font-medium text-slate-300">Density scale</div>
          {[
            ["#E06D53", ">1,000"],
            ["#E06D53cc", "250–1k"],
            ["#7D9D8B", "80–250"],
            ["#3B4A5A", "<80"],
          ].map(([c, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{ background: c }} />
              {label}/km²
            </div>
          ))}
        </div>

        <CursorHUD data={hover} mouse={mouse} />
      </div>

      {/* time scrubber */}
      <div className="px-3 pt-2 pb-3 border-t border-slate-800/80 bg-[#0F141F]">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-7 h-7 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300"
            aria-label={playing ? "Pause timeline" : "Play timeline"}
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setYear(TIMELINE[Math.max(0, yearIndex - 1)])}
            className="w-6 h-6 flex items-center justify-center rounded border border-slate-800 text-slate-400 hover:text-slate-200"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1 relative h-6 flex items-center">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-800" />
            <div
              className="absolute top-1/2 h-px bg-[#6B8DA6]"
              style={{ width: `${(yearIndex / (TIMELINE.length - 1)) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={TIMELINE.length - 1}
              value={yearIndex}
              onChange={(e) => setYear(TIMELINE[Number(e.target.value)])}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Scrub timeline"
            />
            <div
              className="absolute w-7 h-7 -translate-x-1/2 flex items-center justify-center rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-100"
              style={{ left: `${(yearIndex / (TIMELINE.length - 1)) * 100}%` }}
            >
              {year}
            </div>
          </div>
          <button
            onClick={() => setYear(TIMELINE[Math.min(TIMELINE.length - 1, yearIndex + 1)])}
            className="w-6 h-6 flex items-center justify-center rounded border border-slate-800 text-slate-400 hover:text-slate-200"
            aria-label="Next year"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1 text-center font-mono text-[9px] text-slate-600">
          ← → scrub&nbsp;·&nbsp;Space play/pause&nbsp;·&nbsp;{year}
        </div>
      </div>
    </div>
  );
}
