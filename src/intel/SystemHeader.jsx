import { useState, useRef, useEffect } from "react";
import { Search, Command, MapPin, Activity, Database, ChevronDown } from "lucide-react";
import { PIPELINE, VIEW_MODES, STATES } from "./data.js";

// ────────────────────────────────────────────────────────────
// Header & System Status Bar
// ────────────────────────────────────────────────────────────
export default function SystemHeader({ viewMode, onViewModeChange, onSelectRegion }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const results = query.trim()
    ? STATES.filter((s) =>
        `${s.name} ${s.capital} ${s.id}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : STATES.slice(0, 6);

  useEffect(() => {
    if (cmdOpen) setTimeout(() => inputRef.current?.focus(), 40);
  }, [cmdOpen]);

  useEffect(() => {
    if (!cmdOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cmdOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = (id) => {
    onSelectRegion(id);
    setCmdOpen(false);
    setQuery("");
  };

  return (
    <header className="relative z-20 border-b border-slate-800/80 bg-[#0F141F]">
      <div className="flex items-center gap-4 px-4 h-12">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-6 items-center gap-1.5 px-2 rounded bg-slate-900 border border-slate-700/60">
            <span className="text-[13px] font-bold tracking-[0.08em] text-slate-100">TALLY</span>
          </div>
          <span className="hidden xl:inline-flex font-mono text-[10px] tracking-tight text-slate-500 border border-slate-800 rounded px-1.5 py-0.5">
            {PIPELINE.subBadge}
          </span>
        </div>

        {/* Commands */}
        <div className="hidden md:flex items-center gap-1 flex-1 max-w-[520px]">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex flex-1 items-center gap-2 h-8 px-3 rounded-md border border-slate-800 bg-slate-900/80 text-left group hover:border-slate-700/70 transition-colors"
            aria-label="Open command bar"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            <span className="flex-1 text-[12px] text-slate-500 group-hover:text-slate-300">
              Search states, districts, PIN…
            </span>
            <span className="flex items-center gap-0.5 font-mono text-[10px] text-slate-500 border border-slate-800 rounded px-1.5 py-0.5">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>
          <MapPin className="w-4 h-4 text-slate-600 shrink-0" />
        </div>

        {/* System status */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <StatusBadge
            icon={<Activity className="w-3 h-3" />}
            label={`${PIPELINE.latencyMs}ms`}
            kind="ok"
            title="Real-time latency"
          />
          <StatusBadge
            icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-400/90" />}
            label={PIPELINE.syncLabel}
            kind="sync"
            title="Sync status"
          />
          <StatusBadge
            icon={<Database className="w-3 h-3" />}
            label={PIPELINE.provenance}
            kind="reg"
            title="Data provenance"
          />
        </div>
      </div>

      {/* View mode tabs row */}
      <div className="flex items-center gap-3 px-4 h-10 border-t border-slate-800/70 bg-[#0D121C]">
        <span className="font-mono text-[10px] text-slate-600 tracking-wider uppercase">View</span>
        <div className="flex items-center gap-1">
          {VIEW_MODES.map((vm) => (
            <button
              key={vm.id}
              onClick={() => onViewModeChange(vm.id)}
              className={`px-2.5 h-7 rounded text-[11px] font-medium transition-colors ${
                viewMode === vm.id
                  ? "bg-slate-800 text-slate-100 border border-slate-700/60"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {vm.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-600">
            ver {PIPELINE.subBadge.split("//")[1]?.trim()}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
        </div>
      </div>

      {/* Command palette */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] py-24 px-4"
          onMouseDown={() => setCmdOpen(false)}
        >
          <div
            className="mx-auto max-w-md rounded-lg border border-slate-700 bg-[#0F141F] shadow-2xl overflow-hidden animate-[cmdIn_.18s_ease]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3 h-11 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search states, districts, PIN codes…"
                className="flex-1 bg-transparent text-[13px] text-slate-100 placeholder:text-slate-600 outline-none"
              />
              <kbd className="font-mono text-[10px] text-slate-500 border border-slate-800 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>
            <div className="py-1.5">
              <div className="px-3 py-1 font-mono text-[10px] text-slate-600 uppercase tracking-wider">
                Regions
              </div>
              {results.map((s) => (
                <button
                  key={s.id}
                  onClick={() => pick(s.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800/60 text-left"
                >
                  <span className="font-mono text-[11px] text-slate-500 w-8">{s.id}</span>
                  <span className="text-[12.5px] text-slate-200 flex-1">{s.name}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatPopulationCompact(s.population)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function StatusBadge({ icon, label, kind, title }) {
  const styles = {
    ok: "text-emerald-400/90 border-emerald-900/50 bg-emerald-950/30",
    sync: "text-slate-300 border-slate-700/70 bg-slate-900/40",
    reg: "text-sky-400/90 border-sky-900/50 bg-sky-950/30",
  }[kind];
  return (
    <span
      title={title}
      className={`hidden lg:inline-flex items-center gap-1.5 h-6 px-2 rounded font-mono text-[10px] border ${styles}`}
    >
      {icon}
      {label}
    </span>
  );
}

function formatPopulationCompact(v) {
  if (v >= 1e7) return `${(v / 1e7).toFixed(1)} cr`;
  if (v >= 1e5) return `${(v / 1e5).toFixed(1)} L`;
  return String(v);
}
