import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import StudioCard from "./StudioCard.jsx";
import { ONGOING_TASKS, ONGOING_BOOTSTRAP_COLORS } from "./data.js";

// ────────────────────────────────────────────────────────────
// OngoingTasksChart — multi-series stacked bar (pastel top +
// bold bottom) per weekday.
// ────────────────────────────────────────────────────────────
export default function OngoingTasksChart() {
  return (
    <StudioCard title="Ongoing Tasks">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ONGOING_TASKS}
            margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
            barCategoryGap="28%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 30]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
            />
            <Tooltip cursor={{ fill: "#F8FAFC" }} content={<TasksTooltip />} />
            {/* bottom = bold, top = pastel */}
            <Bar dataKey="active" stackId="a" maxBarSize={22} radius={[0, 0, 4, 4]}>
              {ONGOING_TASKS.map((_, i) => (
                <Cell
                  key={`a-${i}`}
                  fill={ONGOING_BOOTSTRAP_COLORS[i % ONGOING_BOOTSTRAP_COLORS.length]}
                />
              ))}
            </Bar>
            <Bar dataKey="total" stackId="a" maxBarSize={22} radius={[4, 4, 0, 0]}>
              {ONGOING_TASKS.map((_, i) => (
                <Cell
                  key={`t-${i}`}
                  fill={withOpacity(
                    ONGOING_BOOTSTRAP_COLORS[i % ONGOING_BOOTSTRAP_COLORS.length],
                    0.45
                  )}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </StudioCard>
  );
}

function withOpacity(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function TasksTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="rounded-lg bg-gray-800 text-white px-3 py-2 shadow-lg">
      <div className="text-[11px] font-semibold mb-0.5">{label}</div>
      <div className="text-[11px] text-gray-300">Feb, {label}</div>
      <div className="text-[12px] font-bold mt-0.5">{total} Tasks</div>
    </div>
  );
}
