import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import censusData from "../modules/dates/data/census-dates.json";
import { getPhaseStatus } from "../modules/dates/dates.utils.js";

// Compute stats from real data
function computeStats() {
  let active = 0, upcoming = 0, completed = 0;
  for (const state of censusData.states) {
    const s1 = getPhaseStatus(state.phaseI.start, state.phaseI.end);
    const s2 = getPhaseStatus(state.phaseII.start, state.phaseII.end);
    if (s1 === "active" || s2 === "active") active++;
    else if (s1 === "upcoming" || s2 === "upcoming") upcoming++;
    else completed++;
  }
  return { active, upcoming, completed, total: censusData.states.length };
}

const MODULES = [
  { to: "/dates",   icon: "📅", title: "Census Dates",       desc: "State-wise Phase I & II schedule for all 36 states & UTs.",                     badge: "Live",        id: "home-card-dates",   live: true  },
  { to: "/wizard",  icon: "🧭", title: "Enumeration Wizard", desc: "Step-by-step guide through all official census questions.",                      badge: "Live",        id: "home-card-wizard",  live: true  },
  { to: "/chat",    icon: "💬", title: "AI Explainer",       desc: "RAG chatbot grounded in official PIB/RGI documents — no hallucinated facts.",    badge: "Coming soon", id: "home-card-chat",    live: false },
  { to: "/privacy", icon: "🔒", title: "Privacy Guide",      desc: "What's collected, what's protected, and how to spot scams.",                     badge: "Coming soon", id: "home-card-privacy", live: false },
  { to: "/viz",     icon: "📊", title: "Data Explorer",      desc: "Visualize public 2011/2021 census data with natural language.",                   badge: "Coming soon", id: "home-card-viz",     live: false },
];

// Animated counter hook
function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 30));
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(start);
      if (start >= target) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

function StatsBar({ stats }) {
  const total = useCounter(stats.total);
  const active = useCounter(stats.active);
  const upcoming = useCounter(stats.upcoming);
  const completed = useCounter(stats.completed);

  return (
    <div className="stats-bar animate-slide-up delay-300">
      <div className="stat-item">
        <div className="stat-value gradient-text">{total}</div>
        <div className="stat-label">States &amp; UTs</div>
      </div>
      <div className="stat-item">
        <div className="stat-value" style={{ color: "#4ade80" }}>{active}</div>
        <div className="stat-label">Phase Active</div>
      </div>
      <div className="stat-item">
        <div className="stat-value" style={{ color: "#ff8c2e" }}>{upcoming}</div>
        <div className="stat-label">Upcoming</div>
      </div>
      <div className="stat-item">
        <div className="stat-value" style={{ color: "#94a3b8" }}>{completed}</div>
        <div className="stat-label">Completed</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const stats = computeStats();

  return (
    <main id="home-page" className="flex-1">
      <div className="container">
        {/* Hero */}
        <section className="hero" aria-label="Tally hero">
          <div className="animate-slide-up">
            <div className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              India's First Digital Census — 2027
            </div>
          </div>

          <h1 className="hero-title animate-slide-up delay-100">
            <span className="gradient-text">Tally</span>
            <br />
            <span style={{ color: "white", fontSize: "clamp(1.5rem,4vw,2.75rem)", fontWeight: 600 }}>
              Your Census 2027 Companion
            </span>
          </h1>

          <p className="hero-subtitle animate-slide-up delay-200">
            Tally explains, guides, and visualizes India's Census 2027.
            It <em>never</em> stores your data — everything sensitive stays in your browser
            and hands off directly to the official RGI portal.
          </p>

          <div className="hero-ctas animate-slide-up delay-300">
            <NavLink to="/dates" id="hero-cta-dates" className="btn-primary">
              📅 View Census Dates
            </NavLink>
            <NavLink to="/wizard" id="hero-cta-wizard" className="btn-ghost">
              🧭 Start Wizard
            </NavLink>
            <a
              href="https://censusindia.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-official"
              className="btn-ghost"
              aria-label="Official Census portal"
            >
              Official Portal ↗
            </a>
          </div>
        </section>

        {/* Stats bar */}
        <StatsBar stats={stats} />

        {/* Module cards */}
        <section aria-label="Tally modules">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 animate-fade-in">
            Modules
          </h2>
          <div className="module-grid">
            {MODULES.map(({ to, icon, title, desc, badge, id, live }, i) => (
              <NavLink
                key={to}
                to={to}
                id={id}
                className={`card module-card animate-slide-up${!live ? " disabled" : ""}`}
                style={{ animationDelay: `${i * 0.08}s` }}
                aria-disabled={!live}
                tabIndex={live ? undefined : -1}
              >
                <div className="flex justify-between items-start">
                  <span className="module-card-icon" aria-hidden="true">{icon}</span>
                  <span className={live ? "badge badge-live" : "badge badge-soon"}>
                    {live && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} aria-hidden="true" />}
                    {badge}
                  </span>
                </div>
                <div>
                  <p className="module-card-title">{title}</p>
                  <p className="module-card-desc">{desc}</p>
                </div>
              </NavLink>
            ))}
          </div>
        </section>

        {/* Privacy guarantee */}
        <div className="privacy-banner animate-fade-in delay-500">
          <p className="privacy-banner-title">🛡️ Privacy Guarantee</p>
          <p className="privacy-banner-text">
            Tally is an <strong style={{ color: "white" }}>assistive layer only</strong>. It never stores, transmits, or persists
            Aadhaar numbers, voter IDs, or any census responses. Identifiers you type are
            validated in-browser using a local checksum and immediately cleared from memory.
            The official RGI Census portal is the sole system of record.
          </p>
        </div>

        <div style={{ height: "3rem" }} />
      </div>
    </main>
  );
}
