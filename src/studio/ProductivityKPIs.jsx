import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import StudioCard from "./StudioCard.jsx";
import { PRODUCTIVITY, PRODUCTIVITY_TOTAL } from "./data.js";

// ────────────────────────────────────────────────────────────
// ProductivityKPIs — multi-colored donut with center label and
// right-side legend.
// ────────────────────────────────────────────────────────────
export default function ProductivityKPIs() {
  return (
    <StudioCard title="Productivity KPIs">
      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative w-[170px] h-[170px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PRODUCTIVITY}
                dataKey="value"
                nameKey="key"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={2}
                stroke="none"
              >
                {PRODUCTIVITY.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[20px] font-bold text-gray-800 leading-none">Task Done</div>
            <div className="text-[20px] font-bold text-gray-800 leading-none mt-0.5">
              {PRODUCTIVITY_TOTAL}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Tasks</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {PRODUCTIVITY.map((p) => (
            <div key={p.key} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
              <span className="flex-1 text-[12.5px] text-gray-500">{p.key}</span>
              <span className="text-[12.5px] font-semibold text-gray-700">
                {String(p.value).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </StudioCard>
  );
}
