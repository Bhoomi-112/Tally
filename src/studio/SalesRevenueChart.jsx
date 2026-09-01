import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import StudioCard from "./StudioCard.jsx";
import { SALES } from "./data.js";

// ────────────────────────────────────────────────────────────
// SalesRevenueChart — smooth vibrant green line.
// ────────────────────────────────────────────────────────────
export default function SalesRevenueChart() {
  return (
    <StudioCard title="Sales and revenue">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SALES} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 250]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              cursor={{ stroke: "#CBD5E1", strokeDasharray: "3 3" }}
              content={<SalesTooltip />}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="none"
              fill="url(#salesFade)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#22C55E", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </StudioCard>
  );
}

function SalesTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-gray-800 text-white px-3 py-2 shadow-lg">
      <div className="text-[11px] text-gray-300">Revenue</div>
      <div className="text-[14px] font-bold">${payload[0].value.toFixed(2)}</div>
    </div>
  );
}
