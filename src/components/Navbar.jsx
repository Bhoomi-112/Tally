import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/dates",   label: "📅 Dates",   id: "nav-dates" },
  { to: "/wizard",  label: "🧭 Wizard",  id: "nav-wizard" },
  { to: "/chat",    label: "💬 Chat",    id: "nav-chat" },
  { to: "/privacy", label: "🔒 Privacy", id: "nav-privacy" },
  { to: "/viz",     label: "📊 Data",    id: "nav-viz" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="navbar" role="banner">
      <nav className="container navbar-inner" aria-label="Main navigation">
        {/* Logo */}
        <NavLink to="/" id="nav-logo" className="flex items-center gap-3" aria-label="Tally home">
          <div style={{
            width: 36, height: 36,
            borderRadius: "50%",
            background: "rgba(255,107,0,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.125rem",
            border: "1px solid rgba(255,107,0,0.25)",
          }}>
            🗳️
          </div>
          <div style={{ lineHeight: 1 }}>
            <div className="logo-name">Tally</div>
            <div className="logo-sub">Census 2027</div>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <ul className="nav-links hide-mobile" role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {NAV_ITEMS.map(({ to, label, id }) => (
            <li key={to}>
              <NavLink
                to={to}
                id={id}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <a
            href="https://censusindia.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            id="nav-official-portal"
            className="btn-primary btn-sm hide-mobile nav-portal-btn"
            aria-label="Official Census portal (opens in new tab)"
          >
            Official Portal ↗
          </a>

          {/* Hamburger */}
          <button
            id="nav-menu-toggle"
            className="mobile-toggle btn-ghost btn-sm"
            style={{ padding: "0.5rem" }}
            onClick={() => setMenuOpen(v => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu animate-fade-in" role="menu">
          {NAV_ITEMS.map(({ to, label, id }) => (
            <NavLink
              key={to}
              to={to}
              id={`m-${id}`}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://censusindia.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-link"
            style={{ color: "#FF6B00" }}
            onClick={() => setMenuOpen(false)}
          >
            Official Portal ↗
          </a>
        </div>
      )}
    </header>
  );
}
