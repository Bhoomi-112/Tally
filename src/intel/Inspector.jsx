import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ShieldCheck, FileClock, Database, ChevronRight } from "lucide-react";
import { AGE_PYRAMID, LITERACY_BAR, AUDIT, STATES, DISTRICTS } from "./data.js";
import { useCursorSpotlight, formatPopulation } from "./utils.js";

// ────────────────────────────────────────────────────────────
// Analytical Inspector — active selection breadcrumb, age
// pyramid, literacy distribution, and data integrity audit.
// ────────────────────────────────────────────────────────────
export default function Inspector({ activeRegion, viewMode }) {
  const region = useMemo(() => {
    if (viewMode === "district" && activeRegion) {
      const dists = DISTRICTS[activeRegion];
      if (dists && dists.length) return { ...dists[0], stateId: activeRegion };
    }
    return STATES.find((s) => s.id === activeRegion) || null;
  }, [activeRegion, viewMode]);

  const isNational = !region || !activeRegion;

  const pyramid = useMemo(
    () =>
      isNational
        ? AGE_PYRAMID
        : AGE_PYRAMID.map((c) => ({
            ...c,
            male:
              c.male *
              (region.population < 4e7 ? 0.72 : 1.05) *
              (region.sexRatio >= 950 ? 1.06 : 0.97),
            female:
              c.female *
              (region.population < 4e7 ? 0.72 : 1.05) *
              (region.sexRatio >= 950 ? 1.07 : 0.97),
          })),
    [isNational, region]
  );

  return (
    <section className="flex flex-col gap-px bg-slate-800/70 border border-slate-800/80 rounded-md overflow-hidden h-full">
      {/* Active selection header */}
      <ActiveHeader region={region} isNational={isNational} />

      {/* Age pyramid */}
      <PyramidCard region={region} pyramid={pyramid} />

      {/* Literacy distribution */}
      <LiteracyCard region={region} />

      {/* Audit card */}
      <AuditCard />
    </section>
  );
}

function ActiveHeader({ region, isNational }) {
  const stateName = region?.stateId ? STATES.find((s) => s.id === region.stateId)?.name : null;
  const crumbs = isNational
    ? ["India"]
    : stateName
      ? ["India", stateName]
      : ["India", region?.name || ""];
  return (
    <div className="px-3.5 py-3 bg-[#0F141F]">
      <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 flex-wrap">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-2.5 h-2.5" />}
            <span className={i === crumbs.length - 1 ? "text-slate-300" : ""}>{c}</span>
          </span>
        ))}
        {!isNational && !stateName && (
          <>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-amber-300/90">{region.name}</span>
          </>
        )}
      </div>
      <div className="mt-1.5 flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold text-slate-100">
          {isNational ? "National Macro View" : stateName ? region.name : region.name}
        </h2>
        <span className="font-mono text-[10px] text-slate-500">
          {stateName || "India"} · {region?.population ? formatPopulation(region.population) : "—"}
        </span>
      </div>
    </div>
  );
}

function PyramidCard({ region, pyramid }) {
  const { ref, onMouseMove } = useCursorSpotlight();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative flex-1 min-h-[220px] bg-[#0F141F] p-3.5 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.035), transparent 80%)",
        }}
      />
      <div className="flex items-center justify-between mb-2 relative">
        <h3 className="font-mono text-[9.5px] text-slate-500 uppercase tracking-[0.14em]">
          Symmetrical Age Pyramid
        </h3>
        <span className="font-mono text-[9px] text-slate-600">M&nbsp;|&nbsp;F</span>
      </div>
      <div className="relative h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={pyramid}
            margin={{ top: 0, right: 4, left: 4, bottom: 0 }}
            barCategoryGap="18%"
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#1a2233" vertical={false} />
            <XAxis
              dataKey="cohort"
              tick={{ fill: "#64748b", fontSize: 8, fontFamily: "ui-monospace,monospace" }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 8, fontFamily: "ui-monospace,monospace" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<PyramidTooltip />} />
            <Bar dataKey="male" radius={[2, 0, 0, 2]} maxBarSize={12}>
              {pyramid.map((d, i) => (
                <Cell key={`m${i}`} fill="#E06D53" />
              ))}
            </Bar>
            <Bar dataKey="female" radius={[0, 2, 2, 0]} maxBarSize={12}>
              {pyramid.map((d, i) => (
                <Cell key={`f${i}`} fill="#7D9D8B" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex items-center justify-center gap-4 font-mono text-[9px]">
        <span className="flex items-center gap-1 text-slate-400">
          <span className="w-2 h-2 rounded-sm bg-[#E06D53]" /> Male {region ? "adj." : "nat."}
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <span className="w-2 h-2 rounded-sm bg-[#7D9D8B]" /> Female {region ? "adj." : "nat."}
        </span>
      </div>
    </div>
  );
}

function PyramidTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const male = Math.abs(payload[0]?.value || 0);
  const female = payload[1]?.value != null ? Math.abs(payload[1].value) : 0;
  return (
    <div className="rounded border border-slate-700 bg-[#0A0D14]/95 px-2 py-1.5 font-mono text-[10px] shadow-xl">
      <div className="text-slate-300 mb-1">Age {label}</div>
      <div className="flex items-center gap-1 text-[#E06D53]">
        <span className="text-slate-500">M</span> {male.toFixed(1)}%
      </div>
      <div className="flex items-center gap-1 text-[#7D9D8B]">
        <span className="text-slate-500">F</span> {female.toFixed(1)}%
      </div>
    </div>
  );
}

function LiteracyCard({ region }) {
  const { ref, onMouseMove } = useCursorSpotlight();
  const data = useMemo(
    () =>
      LITERACY_BAR.map((d) => {
        const base = region ? region.literacy : 74.4;
        const adjust = Math.round((base - 74.4) * 0.5);
        if (d.key === "Higher") return { ...d, value: Math.max(8, d.value + adjust * 0.4) };
        if (d.key === "Non-lit") return { ...d, value: Math.max(3, d.value - adjust) };
        return d;
      }),
    [region]
  );
  const colors = ["#6B8DA6", "#E5A95D", "#E06D53", "#3B4A5A"];

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative bg-[#0F141F] px-3.5 py-3 overflow-hidden border-t border-slate-800/70"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.035), transparent 80%)",
        }}
      />
      <div className="flex items-center justify-between mb-2 relative">
        <h3 className="font-mono text-[9.5px] text-slate-500 uppercase tracking-[0.14em]">
          Socio-Economic & Literacy
        </h3>
        <span className="font-mono text-[9px] text-slate-600">
          {region ? `lit ${region.literacy}%` : "lit 74.4%"}
        </span>
      </div>
      <div className="relative h-[64px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="key"
              width={52}
              tick={{ fill: "#64748b", fontSize: 8, fontFamily: "ui-monospace,monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<LiteracyTooltip />} />
            <Bar dataKey="value" radius={[0, 2, 2, 0]} maxBarSize={12}>
              {data.map((d, i) => (
                <Cell key={`${d.key}-${i}`} fill={colors[i % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LiteracyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-slate-700 bg-[#0A0D14]/95 px-2 py-1.5 font-mono text-[10px] shadow-xl">
      <div className="text-slate-300">{label}</div>
      <div className="text-[#E5A95D]">{payload[0].value.toFixed(1)}%</div>
    </div>
  );
}

function AuditCard() {
  const { ref, onMouseMove } = useCursorSpotlight();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative bg-[#0F141F] px-3.5 py-3 overflow-hidden border-t border-slate-800/70"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.035), transparent 80%)",
        }}
      />
      <div className="flex items-center gap-1.5 mb-2 relative">
        <ShieldCheck className="w-3 h-3 text-[#7D9D8B]" />
        <h3 className="font-mono text-[9.5px] text-slate-500 uppercase tracking-[0.14em]">
          Data Integrity & Audit
        </h3>
      </div>
      <div className="relative grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10px]">
        <AuditRow icon={FileClock} label="Source ts" value={AUDIT.sourceTimestamp} />
        <AuditRow icon={Database} label="Sample" value={AUDIT.sampleSize} />
        <AuditRow label="Confidence" value={AUDIT.confidence} accent />
        <AuditRow label="Significance" value={AUDIT.pValue} accent />
      </div>
    </div>
  );
}

function AuditRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3 text-slate-600 shrink-0" />}
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className={`truncate ${accent ? "text-emerald-400/90" : "text-slate-300"}`}>
        {value}
      </span>
    </div>
  );
}
