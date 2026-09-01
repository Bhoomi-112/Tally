import { useState } from "react";
import censusDemo from "../../data/census-demographics.json";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";

const { national: n, states: allStates, agePyramid, urbanizationTrend } = censusDemo;
const stateList = Object.entries(allStates);

function formatPop(val) {
  if (val >= 1e9) return (val / 1e9).toFixed(2) + "B";
  if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
  return val.toLocaleString();
}

function BenchmarkRow({ label, you, nat, unit }) {
  return (
    <div style={{ marginBottom: ".85rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontSize: ".75rem",
        }}
      >
        <span style={{ color: "var(--color-ink-2-light)" }}>{label}</span>
        <span className="benchmark-vals">
          <span className="benchmark-you">
            {you}
            {unit}
          </span>
          <span className="benchmark-vs">vs</span>
          <span className="benchmark-nat">
            {nat}
            {unit}
          </span>
        </span>
      </div>
      <div className="benchmark-gauge" style={{ position: "relative" }}>
        <div
          className="benchmark-gauge-you"
          style={{ width: `${Math.min((you / (nat * 1.4)) * 100, 100)}%` }}
        />
        <div
          className="benchmark-gauge-nat"
          style={{ left: `${Math.min((nat / (nat * 1.4)) * 100, 100)}%` }}
          title={`National avg: ${nat}${unit}`}
        />
      </div>
    </div>
  );
}

const PYRAMID_DATA = agePyramid.map((row) => ({
  name: row.ageGroup,
  male: -row.male,
  female: row.female,
  maleAbs: row.male,
  femaleAbs: row.female,
}));

export default function InsightsPanel({ selectedState }) {
  const [activeTab, setActiveTab] = useState("benchmark");
  const sel = selectedState ? allStates[selectedState] : null;
  const selData = sel ? { ...sel } : null;

  return (
    <div className="insights-panel animate-fade-up">
      {/* Tabs */}
      <div className="tab-nav">
        {[
          { id: "benchmark", label: "Benchmark" },
          { id: "pyramid", label: "Age Pyramid" },
          { id: "urban", label: "Urbanization" },
        ].map((t) => (
          <button
            key={t.id}
            className={`tab-btn${activeTab === t.id ? " active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="insights-scroll">
        {/* === Benchmark Tab === */}
        {activeTab === "benchmark" && (
          <div className="widget" style={{ margin: "1rem" }}>
            <div className="widget-header">
              <span className="widget-title">Regional Benchmark</span>
              <span
                className="widget-badge"
                style={{
                  background: selData ? "var(--color-terracotta-dim)" : "var(--color-dusty-dim)",
                  color: selData ? "var(--color-terracotta)" : "var(--color-dusty)",
                  borderRadius: 999,
                  padding: ".15rem .5rem",
                }}
              >
                {selData ? selData.name : "National Average"}
              </span>
            </div>

            <BenchmarkRow
              label="Population"
              you={selData ? formatPop(selData.population) : formatPop(n.population)}
              nat={formatPop(n.population)}
              unit=""
              higherBetter={false}
            />
            <BenchmarkRow
              label="Sex Ratio"
              you={selData ? selData.sexRatio : n.sexRatio}
              nat={n.sexRatio}
              unit=""
              higherBetter={true}
            />
            <BenchmarkRow
              label="Literacy"
              you={selData ? selData.literacy : n.literacy.overall}
              nat={n.literacy.overall}
              unit="%"
              higherBetter={true}
            />
            <BenchmarkRow
              label="Urban Share"
              you={selData ? selData.urbanShare : n.urbanShare}
              nat={n.urbanShare}
              unit="%"
              higherBetter={false}
            />
            <BenchmarkRow
              label="Median Age"
              you={selData ? selData.medianAge : n.medianAge}
              nat={n.medianAge}
              unit="yrs"
              higherBetter={false}
            />

            <div className="benchmark-ref">
              Sources: Census of India 2011, SRS, NFHS · Values are model projections for 2026
            </div>
          </div>
        )}

        {/* === Age Pyramid Tab === */}
        {activeTab === "pyramid" && (
          <div className="widget" style={{ margin: "1rem" }}>
            <div className="widget-header">
              <span className="widget-title">Age-Gender Pyramid</span>
              <span
                className="widget-badge"
                style={{
                  background: "var(--color-amber-dim)",
                  color: "var(--color-amber)",
                  borderRadius: 999,
                  padding: ".15rem .5rem",
                }}
              >
                2026 Est.
              </span>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart
                data={PYRAMID_DATA}
                layout="vertical"
                margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 9, fill: "var(--color-ink-3-light)" }}
                  tickFormatter={(v) => `${Math.abs(v)}%`}
                  domain={[-12, 12]}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "var(--color-ink-3-light)" }}
                  width={36}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div
                        style={{
                          background: "var(--color-surface-light)",
                          border: "1px solid var(--color-border-light)",
                          borderRadius: 10,
                          padding: ".6rem .8rem",
                          fontSize: ".72rem",
                          boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            marginBottom: ".2rem",
                            color: "var(--color-ink-light)",
                          }}
                        >
                          {d?.name}
                        </div>
                        <div style={{ color: "var(--color-terracotta)", fontSize: ".68rem" }}>
                          Male: {d?.maleAbs}%
                        </div>
                        <div style={{ color: "var(--color-amber)", fontSize: ".68rem" }}>
                          Female: {d?.femaleAbs}%
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="male"
                  fill="var(--color-terracotta)"
                  radius={[3, 0, 0, 3]}
                  barSize={10}
                />
                <Bar
                  dataKey="female"
                  fill="var(--color-amber)"
                  radius={[0, 3, 3, 0]}
                  barSize={10}
                />
              </ComposedChart>
            </ResponsiveContainer>

            <div className="chart-legend">
              <span className="chart-legend-item">
                <span
                  className="chart-legend-swatch"
                  style={{ background: "var(--color-terracotta)" }}
                />{" "}
                Male
              </span>
              <span className="chart-legend-item">
                <span
                  className="chart-legend-swatch"
                  style={{ background: "var(--color-amber)" }}
                />{" "}
                Female
              </span>
            </div>
          </div>
        )}

        {/* === Urbanization Tab === */}
        {activeTab === "urban" && (
          <div className="widget" style={{ margin: "1rem" }}>
            <div className="widget-header">
              <span className="widget-title">Urbanization Trend</span>
              <span
                className="widget-badge"
                style={{
                  background: "var(--color-dusty-dim)",
                  color: "var(--color-dusty)",
                  borderRadius: 999,
                  padding: ".15rem .5rem",
                }}
              >
                1991–2026
              </span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart
                data={urbanizationTrend}
                margin={{ left: -10, right: 10, top: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="urbanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-dusty)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-dusty)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
                <XAxis dataKey="year" tick={{ fontSize: 9, fill: "var(--color-ink-3-light)" }} />
                <YAxis
                  tick={{ fontSize: 9, fill: "var(--color-ink-3-light)" }}
                  domain={[20, 40]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div
                        style={{
                          background: "var(--color-surface-light)",
                          border: "1px solid var(--color-border-light)",
                          borderRadius: 10,
                          padding: ".6rem .8rem",
                          fontSize: ".72rem",
                          boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            marginBottom: ".15rem",
                            color: "var(--color-ink-light)",
                          }}
                        >
                          {label}
                        </div>
                        <div style={{ color: "var(--color-dusty)", fontSize: ".68rem" }}>
                          Urban: {payload[0]?.value}%
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="urban"
                  stroke="var(--color-dusty)"
                  strokeWidth={2.5}
                  fill="url(#urbanGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="urban"
                  stroke="var(--color-dusty)"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: "var(--color-dusty)", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                />
              </ComposedChart>
            </ResponsiveContainer>

            <div className="chart-legend">
              <span className="chart-legend-item">
                <span
                  className="chart-legend-swatch"
                  style={{ background: "var(--color-dusty)" }}
                />{" "}
                Urban Share (%)
              </span>
            </div>

            {/* Top urbanized states */}
            <div style={{ marginTop: ".9rem" }}>
              <div className="section-label" style={{ marginBottom: ".4rem" }}>
                Most Urbanized
              </div>
              {stateList
                .sort((a, b) => b[1].urbanShare - a[1].urbanShare)
                .slice(0, 5)
                .map(([id, s]) => (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".6rem",
                      padding: ".35rem 0",
                      borderBottom: "1px solid var(--color-border-light)",
                      fontSize: ".75rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--color-ink-3-light)",
                        fontSize: ".68rem",
                        width: "1.3rem",
                        textAlign: "right",
                      }}
                    >
                      {stateList
                        .sort((a, b) => b[1].urbanShare - a[1].urbanShare)
                        .indexOf([id, s]) + 1}
                    </span>
                    <span style={{ flex: 1, fontWeight: 600, color: "var(--color-ink-light)" }}>
                      {s.name}
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--color-dusty)" }}>
                      {s.urbanShare}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Civic footnote */}
        <div className="civic-footnote">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.1" />
            <path
              d="M5.2 8l2 2 3.6-3.6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Verified via Registrar General &amp; Census Commissioner</span>
        </div>
      </div>
    </div>
  );
}
