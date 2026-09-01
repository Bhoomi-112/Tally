import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ComingSoon({ title, icon }) {
  const { t } = useTranslation();
  return (
    <main className="page" aria-label={`${title} — ${t("comingSoon.comingSoon")}`}>
      <div
        className="container"
        style={{ textAlign: "center", paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div
          className="animate-fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "var(--color-surface-2-light)",
            border: "1px solid var(--color-border-light)",
            fontSize: "2.8rem",
            marginBottom: "1.5rem",
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <h1 className="section-title animate-fade-up delay-100" style={{ marginBottom: "0.75rem" }}>
          {title}
        </h1>
        <p
          className="page-desc animate-fade-up delay-200"
          style={{ margin: "0 auto 2rem", textAlign: "center" }}
        >
          {t("comingSoon.comingSoon")}{" "}
          <strong style={{ color: "var(--color-terracotta)" }}>Census Dates</strong> {""}
          {t("comingSoon.and")}{" "}
          <strong style={{ color: "var(--color-terracotta)" }}>Enumeration Wizard</strong>{" "}
          {t("comingSoon.availableNow")}
        </p>
        <div
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}
          className="animate-fade-up delay-300"
        >
          <NavLink to="/dates" className="btn btn-primary">
            {t("comingSoon.viewDates")}
          </NavLink>
          <NavLink to="/wizard" className="btn btn-ghost">
            {t("comingSoon.tryWizard")}
          </NavLink>
        </div>
      </div>
    </main>
  );
}
