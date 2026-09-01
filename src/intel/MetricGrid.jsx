import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { TOP_METRICS, ACCENT_HEX } from "./data.js";
import { useCursorSpotlight } from "./utils.js";

// ────────────────────────────────────────────────────────────
// Precision Metric Grid — four dense, scannable data modules
// with sparklines and delta tags.
// ────────────────────────────────────────────────────────────
export default function MetricGrid() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800/70 border border-slate-800/80 rounded-md overflow-hidden">
      {TOP_METRICS.map((m) => (
        <MetricCell key={m.id} metric={m} />
      ))}
    </section>
  );
}

function MetricCell({ metric }) {
  const { ref, onMouseMove } = useCursorSpotlight();
  const color = ACCENT_HEX[metric.accent];
  const positive = metric.delta.startsWith("+");

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative bg-[#0F141F] p-3.5 overflow-hidden cursor-default group"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.04), transparent 80%)",
        }}
      />

      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9.5px] text-slate-500 uppercase tracking-[0.14em]">
          {metric.label}
        </span>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}55` }}
        />
      </div>

      <div className="flex items-end gap-2">
        <span className="font-mono text-[19px] leading-none text-slate-100 tracking-tight">
          {metric.value}
        </span>
        <span
          className={`ml-auto font-mono text-[10px] flex items-center gap-0.5 rounded px-1 py-0.5 ${
            positive ? "text-[#E06D53]" : "text-[#7D9D8B]"
          }`}
          style={{ background: positive ? "rgba(224,109,83,0.1)" : "rgba(125,157,139,0.1)" }}
        >
          {positive ? (
            <ArrowUpRight className="w-2.5 h-2.5" />
          ) : (
            <ArrowDownRight className="w-2.5 h-2.5" />
          )}
          {metric.delta}
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="font-mono text-[9.5px] text-slate-500">{metric.deltaKind}</span>
        <span className="font-mono text-[9.5px] text-slate-600">{metric.coverage}</span>
      </div>

      <div className="h-8 mt-2 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={metric.spark.map((v, i) => ({ v, i }))}
            margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`spark-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.4}
              fill={`url(#spark-${metric.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
