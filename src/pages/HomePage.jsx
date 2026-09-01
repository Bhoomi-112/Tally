import { NavLink } from "react-router-dom";
import { useState } from "react";
import censusData from "../modules/dates/data/census-dates.json";
import { getPhaseStatus } from "../modules/dates/dates.utils.js";
import KPISummary from "../components/dashboard/KPISummary.jsx";
import MapCanvas from "../components/dashboard/MapCanvas.jsx";
import InsightsPanel from "../components/dashboard/InsightsPanel.jsx";

function computeStats() {
  let active = 0,
    upcoming = 0,
    completed = 0;
  for (const state of censusData.states) {
    const s1 = getPhaseStatus(state.phaseI.start, state.phaseI.end);
    const s2 = getPhaseStatus(state.phaseII.start, state.phaseII.end);
    if (s1 === "active" || s2 === "active") active++;
    else if (s1 === "upcoming" || s2 === "upcoming") upcoming++;
    else completed++;
  }
  return { active, upcoming, completed, total: censusData.states.length };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getGreetingEmoji() {
  const h = new Date().getHours();
  if (h < 12) return "☀️";
  if (h < 17) return "🌤️";
  return "🌙";
}

const MODULES = [
  {
    to: "/dates",
    title: "Census Dates",
    desc: "State-wise Phase I & II schedule for all 36 states & UTs.",
    badge: "Live",
    live: true,
  },
  {
    to: "/wizard",
    title: "Enumeration Wizard",
    desc: "Step-by-step guide through all official census questions.",
    badge: "Live",
    live: true,
  },
  {
    to: "/chat",
    title: "AI Explainer",
    desc: "RAG chatbot grounded in official PIB/RGI documents — no hallucinated facts.",
    badge: "Soon",
    live: false,
  },
  {
    to: "/privacy",
    title: "Privacy Guide",
    desc: "What's collected, what's protected, and how to spot scams.",
    badge: "Soon",
    live: false,
  },
  {
    to: "/viz",
    title: "Data Explorer",
    desc: "Visualize public 2011/2021 census data with natural language.",
    badge: "Soon",
    live: false,
  },
];

const ICONS = ["📅", "🧭", "💬", "🔒", "📊"];

export default function HomePage() {
  const stats = computeStats();
  const [selectedState, setSelectedState] = useState(null);
  const greeting = getGreeting();

  return (
    <main className="page" style={{ paddingTop: 0 }}>
      <div className="container" style={{ paddingTop: "1.75rem" }}>
        {/* Greeting banner */}
        <div className="greeting-banner animate-fade-up" style={{ marginBottom: "1.5rem" }}>
          <div className="greeting-avatar">B</div>
          <div className="greeting-text">
            <div className="greeting-salutation">
              {greeting}, Bhoomi {getGreetingEmoji()}
            </div>
            <div className="greeting-sub">
              Tracking demographic shifts across Maharashtra &amp; {stats.total - 1} States
            </div>
          </div>
          <div className="greeting-stat">
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
            {stats.active} Active
          </div>
        </div>

        {/* KPI Summary */}
        <KPISummary />

        {/* Split workspace: Map (60%) + Insights (40%) */}
        <div className="workspace">
          <div className="workspace-map">
            <MapCanvas selectedState={selectedState} onStateSelect={setSelectedState} />
          </div>
          <div className="workspace-side">
            <InsightsPanel selectedState={selectedState} />
          </div>
        </div>

        {/* Module cards */}
        <section style={{ marginTop: "2.25rem" }} aria-label="Tally modules">
          <div className="section-label animate-fade-up delay-300">Modules</div>
          <div className="module-grid animate-fade-up delay-400">
            {MODULES.map(({ to, title, desc, badge, live }, i) => (
              <NavLink
                key={to}
                to={to}
                className={`card module-card${!live ? " disabled" : ""}`}
                aria-disabled={!live}
                tabIndex={live ? undefined : -1}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div className="module-card-icon">
                    <span style={{ fontSize: "1.25rem" }} aria-hidden="true">
                      {ICONS[i]}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <p className="module-card-title">{title}</p>
                      <span className={live ? "badge badge-live" : "badge badge-soon"}>
                        {live && <span className="badge-live-dot" aria-hidden="true" />}
                        {badge}
                      </span>
                    </div>
                    <p className="module-card-desc">{desc}</p>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </section>

        {/* Privacy guarantee */}
        <div className="privacy-banner animate-fade-up delay-500" style={{ marginTop: "1.75rem" }}>
          <div className="privacy-banner-title">🛡️ Privacy Guarantee</div>
          <p className="privacy-banner-text">
            Tally is an{" "}
            <strong style={{ color: "var(--color-verified)" }}>assistive layer only</strong>. It
            never stores, transmits, or persists Aadhaar numbers, voter IDs, or any census
            responses. Identifiers you type are validated in-browser using a local checksum and
            immediately cleared from memory. The official RGI Census portal is the sole system of
            record.
          </p>
        </div>

        <div style={{ height: "3rem" }} />
      </div>
    </main>
  );
}
