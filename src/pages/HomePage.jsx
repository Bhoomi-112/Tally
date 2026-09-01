import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import censusData from "../modules/dates/data/census-dates.json";
import { getPhaseStatus } from "../modules/dates/dates.utils.js";
import KPISummary from "../components/dashboard/KPISummary.jsx";
import MapCanvas from "../components/dashboard/MapCanvas.jsx";
import InsightsPanel from "../components/dashboard/InsightsPanel.jsx";

const ICONS = ["📅", "🧭", "💬", "🔒", "📊"];

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

function getGreeting(t) {
  const h = new Date().getHours();
  if (h < 12) return t("home.goodMorning");
  if (h < 17) return t("home.goodAfternoon");
  return t("home.goodEvening");
}

function getGreetingEmoji() {
  const h = new Date().getHours();
  if (h < 12) return "☀️";
  if (h < 17) return "🌤️";
  return "🌙";
}

export default function HomePage() {
  const { t } = useTranslation();
  const stats = computeStats();
  const [selectedState, setSelectedState] = useState(null);
  const greeting = getGreeting(t);

  const MODULES = [
    {
      to: "/dates",
      title: t("home.moduleDates"),
      desc: t("home.moduleDatesDesc"),
      badge: t("home.badgeLive"),
      live: true,
    },
    {
      to: "/wizard",
      title: t("home.moduleWizard"),
      desc: t("home.moduleWizardDesc"),
      badge: t("home.badgeLive"),
      live: true,
    },
    {
      to: "/chat",
      title: t("home.moduleChat"),
      desc: t("home.moduleChatDesc"),
      badge: t("home.badgeSoon"),
      live: true,
    },
    {
      to: "/privacy",
      title: t("home.modulePrivacy"),
      desc: t("home.modulePrivacyDesc"),
      badge: t("home.badgeSoon"),
      live: false,
    },
    {
      to: "/viz",
      title: t("home.moduleData"),
      desc: t("home.moduleDataDesc"),
      badge: t("home.badgeSoon"),
      live: true,
    },
  ];

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
              {t("home.tracking", { count: stats.total - 1 })}
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
            {stats.active} {t("home.active")}
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
        <section style={{ marginTop: "2.25rem" }} aria-label={t("home.modules")}>
          <div className="section-label animate-fade-up delay-300">{t("home.modules")}</div>
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
          <div className="privacy-banner-title">{t("home.privacyTitle")}</div>
          <p className="privacy-banner-text">{t("home.privacyText")}</p>
        </div>

        <div style={{ height: "3rem" }} />
      </div>
    </main>
  );
}