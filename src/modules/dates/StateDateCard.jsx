import { formatDate, getPhaseStatus } from "./dates.utils.js";

function CountdownBadge({ start, end }) {
  const status = getPhaseStatus(start, end);
  const today = new Date();

  if (status === "active") {
    const daysLeft = Math.ceil((new Date(end + "T00:00:00") - today) / 86400000);
    return (
      <span
        className="countdown countdown-active"
        aria-label={`Active — ${daysLeft} days remaining`}
      >
        ● Active · {daysLeft}d left
      </span>
    );
  }
  if (status === "upcoming") {
    const daysTo = Math.ceil((new Date(start + "T00:00:00") - today) / 86400000);
    return (
      <span className="countdown countdown-upcoming" aria-label={`Starts in ${daysTo} days`}>
        ⏳ {daysTo}d to start
      </span>
    );
  }
  return (
    <span className="countdown countdown-completed" aria-label="Completed">
      ✓ Done
    </span>
  );
}

function PhaseBlock({ phase, phaseKey }) {
  return (
    <div className={`phase-block`}>
      <div
        className={`phase-label-tag ${phaseKey === "phaseI" ? "phase-label-tag-1" : "phase-label-tag-2"}`}
      >
        {phaseKey === "phaseI" ? "Phase I" : "Phase II"}
      </div>

      <div className="phase-name">{phase.label}</div>

      <div className="phase-dates">
        <time dateTime={phase.start}>{formatDate(phase.start)}</time>
        <span className="phase-date-arrow" aria-hidden="true">
          →
        </span>
        <time dateTime={phase.end}>{formatDate(phase.end)}</time>
      </div>

      <div className="phase-meta-row">
        <CountdownBadge start={phase.start} end={phase.end} />
        <a
          href={phase.source}
          target="_blank"
          rel="noopener noreferrer"
          className="phase-source-link"
          aria-label={`Official source for ${phase.label} (new tab)`}
        >
          Source ↗
        </a>
      </div>
    </div>
  );
}

export default function StateDateCard({ state }) {
  const { name, id, region, phaseI, phaseII } = state;
  const isProvisional = phaseI.provisional || phaseII.provisional;

  return (
    <article
      className="card state-card animate-fade-in"
      aria-label={`Census 2027 dates for ${name}`}
      id={`state-card-${id}`}
    >
      {/* Header */}
      <header className="state-card-header">
        <div>
          <h2 className="state-name">{name}</h2>
          <p className="state-meta">
            {region} · {id}
          </p>
        </div>
        {isProvisional && (
          <span className="badge badge-provisional" title="Dates are provisional">
            ⚠ Provisional
          </span>
        )}
      </header>

      {/* Phases */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        <PhaseBlock phase={phaseI} phaseKey="phaseI" />
        <PhaseBlock phase={phaseII} phaseKey="phaseII" />
      </div>

      {/* Footer */}
      <footer className="card-footer">
        Last verified: <time dateTime={phaseI.lastVerified}>{formatDate(phaseI.lastVerified)}</time>
      </footer>
    </article>
  );
}
