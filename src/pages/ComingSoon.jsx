import { NavLink } from "react-router-dom";

export default function ComingSoon({ title, icon }) {
  return (
    <main className="page" aria-label={`${title} — coming soon`}>
      <div className="container" style={{ textAlign: "center", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <p style={{ fontSize: "4rem", marginBottom: "1.25rem" }} aria-hidden="true">{icon}</p>
        <h1 className="section-title gradient-text" style={{ marginBottom: "0.75rem" }}>{title}</h1>
        <p style={{ color: "#64748b", fontSize: "0.9375rem", maxWidth: "26rem", margin: "0 auto 2rem" }}>
          This module is coming soon. The{" "}
          <strong style={{ color: "#ff8c2e" }}>Census Dates</strong> and{" "}
          <strong style={{ color: "#ff8c2e" }}>Enumeration Wizard</strong> modules are available now.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <NavLink to="/dates" className="btn-primary">📅 View Dates</NavLink>
          <NavLink to="/wizard" className="btn-ghost">🧭 Try Wizard</NavLink>
        </div>
      </div>
    </main>
  );
}
