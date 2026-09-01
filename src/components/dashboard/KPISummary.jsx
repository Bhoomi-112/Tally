import censusDemo from "../../data/census-demographics.json";

const { national: n } = censusDemo;

function formatPop(val) {
  if (val >= 1e9) return (val / 1e9).toFixed(2) + "B";
  if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
  return val.toLocaleString();
}

function ArrowIcon({ positive }) {
  return (
    <svg className="kpi-delta-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      {positive ? (
        <path
          d="M6 2.5v7M6 2.5l2.5 2.5M6 2.5L3.5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M6 9.5v-7M6 9.5l2.5-2.5M6 9.5L3.5 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.2 8l2 2 3.6-3.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConfidenceBadge({ value }) {
  return (
    <span className="kpi-conf" title="Data confidence level">
      <VerifiedIcon />
      {value}%
    </span>
  );
}

function LiteracyBar({ label, value, width, color }) {
  return (
    <div style={{ marginBottom: ".45rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: ".7rem",
          marginBottom: ".15rem",
        }}
      >
        <span style={{ color: "var(--color-ink-3-light)" }}>{label}</span>
        <span style={{ fontWeight: 600, color: "var(--color-ink-light)" }}>{value}%</span>
      </div>
      <div className="kpi-mini-bar">
        <div className="kpi-mini-bar-fill" style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}

function AgeSegment({ label, share, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".4rem" }}>
      <span style={{ width: 8, height: 8, borderRadius: 3, background: color, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: ".72rem", color: "var(--color-ink-2-light)" }}>
        {label}
      </span>
      <span style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--color-ink-light)" }}>
        {share}%
      </span>
    </div>
  );
}

export default function KPISummary() {
  return (
    <div className="kpi-row animate-fade-up">
      {/* Population */}
      <div className="kpi-card">
        <div className="kpi-label">
          Enumerated Population
          <ConfidenceBadge value={n.confidence} />
        </div>
        <div className="kpi-value">
          {formatPop(n.population)}
          <span className="kpi-unit">est.</span>
        </div>
        <div className={`kpi-delta ${n.populationDeltaYoY > 0 ? "pos" : "neg"}`}>
          <ArrowIcon positive={n.populationDeltaYoY > 0} />+{n.populationDeltaYoY}% YoY
        </div>
      </div>

      {/* Sex Ratio */}
      <div className="kpi-card">
        <div className="kpi-label">Sex Ratio</div>
        <div className="kpi-value">
          {n.sexRatio}
          <span className="kpi-unit">per 1000</span>
        </div>
        <div className="kpi-delta pos" style={{ marginTop: ".45rem" }}>
          <ArrowIcon positive />+{n.sexRatio - n.sexRatioBaseline} from baseline
        </div>
        <div className="kpi-mini-bar" style={{ marginTop: ".6rem" }}>
          <div
            className="kpi-mini-bar-fill"
            style={{ width: `${(n.sexRatio / 1100) * 100}%`, background: "var(--color-dusty)" }}
          />
          <div
            className="kpi-mini-marker"
            style={{ left: `${(n.sexRatioBaseline / 1100) * 100}%` }}
            title={`Baseline ${n.sexRatioBaseline}`}
          />
        </div>
        <div className="kpi-delta path">Baseline: {n.sexRatioBaseline}</div>
      </div>

      {/* Literacy & Education */}
      <div className="kpi-card">
        <div className="kpi-label">Literacy & Education</div>
        <div className="kpi-value">{n.literacy.overall}%</div>
        <div className="kpi-delta pos" style={{ marginTop: ".35rem" }}>
          <ArrowIcon positive />+{(n.literacy.overall - n.literacyBaseline).toFixed(1)} from
          baseline
        </div>
        <div style={{ marginTop: ".6rem" }}>
          <LiteracyBar
            label="Primary"
            value={n.literacy.primary}
            width={n.literacy.primary}
            color="var(--color-sage)"
          />
          <LiteracyBar
            label="Secondary"
            value={n.literacy.secondary}
            width={n.literacy.secondary}
            color="var(--color-terracotta)"
          />
          <LiteracyBar
            label="Higher"
            value={n.literacy.higher}
            width={n.literacy.higher}
            color="var(--color-dusty)"
          />
        </div>
      </div>

      {/* Median Age & Dependency */}
      <div className="kpi-card">
        <div className="kpi-label">Median Age & Dependency</div>
        <div className="kpi-value">
          {n.medianAge}
          <span className="kpi-unit">years</span>
        </div>
        <div style={{ marginTop: ".7rem" }}>
          <AgeSegment
            label="Working-age (15-59)"
            share={n.workingAgeShare}
            color="var(--color-terracotta)"
            colorDim="var(--color-terracotta-dim)"
          />
          <AgeSegment
            label="Youth (0-14)"
            share={n.youthShare}
            color="var(--color-sage)"
            colorDim="var(--color-sage-dim)"
          />
          <AgeSegment
            label="Senior (60+)"
            share={n.seniorShare}
            color="var(--color-dusty)"
            colorDim="var(--color-dusty-dim)"
          />
        </div>
      </div>
    </div>
  );
}
