import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const ROLES = [
  { id: "citizen", label: "Citizen View", icon: "👤" },
  { id: "policy", label: "Policy Maker", icon: "🏛️" },
  { id: "research", label: "Researcher", icon: "🔬" },
];

const PIN_DISTRICTS = [
  { id: "MH", name: "Maharashtra" },
  { id: "DL", name: "Delhi" },
  { id: "KA", name: "Karnataka" },
  { id: "TN", name: "Tamil Nadu" },
  { id: "GJ", name: "Gujarat" },
  { id: "WB", name: "West Bengal" },
  { id: "KL", name: "Kerala" },
  { id: "UP", name: "Uttar Pradesh" },
];

function VerifiedBadge() {
  return (
    <span className="logo-verified" title="National Census Registry — Verified Data Stream">
      <svg viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1.5l1.7 1.2 2.2-.3.2 2.2 2 .6-1.3 1.8L14.5 9l-1.6 1.2.2 2.2-2.2-.3L9.8 13.3l-.7-2.1L8 10.3l-1.1.9-.7 2.1-1.7-.8.2-2.2L3.1 9l1.5-1.4L3.3 5.6l2-.6.2-2.2 2.2.3z"
          fill="#2F7D4F"
        />
        <path d="M6.5 10.8l-1.9-1.9.7-.7 1.2 1.2 2.9-2.9.7.7z" fill="#fff" />
      </svg>
      Verified Data Stream
    </span>
  );
}

export default function Navbar({ onSearchOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [pinnedDistrict, setPinnedDistrict] = useState(null);
  const [pinMenuOpen, setPinMenuOpen] = useState(false);
  const location = useLocation();

  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setMenuOpen(false);
      setRoleMenuOpen(false);
      setPinMenuOpen(false);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSearchOpen?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSearchOpen]);

  useEffect(() => {
    if (!roleMenuOpen && !pinMenuOpen) return;
    const close = (e) => {
      if (!e.target.closest(".role-switcher")) setRoleMenuOpen(false);
      if (!e.target.closest(".pin-dropdown")) setPinMenuOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [roleMenuOpen, pinMenuOpen]);

  return (
    <header className="navbar" role="banner">
      <nav className="container navbar-inner" aria-label="Main navigation">
        {/* Logo */}
        <NavLink to="/" id="nav-logo" className="logo" aria-label="Tally home">
          <div className="logo-mark">T</div>
          <div className="logo-text">
            <div className="logo-name">
              Tally <span className="logo-phonetic">/tăl′ē/</span>
            </div>
            <div className="logo-sub">Census 2027</div>
          </div>
          <VerifiedBadge />
          <span className="logo-tooltip" role="tooltip">
            टैली · Tally
          </span>
        </NavLink>

        {/* Desktop nav */}
        <ul className="nav-links" role="list">
          {[
            { to: "/dates", label: "Dates" },
            { to: "/wizard", label: "Wizard" },
            { to: "/chat", label: "Chat" },
            { to: "/privacy", label: "Privacy" },
            { to: "/viz", label: "Data" },
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Search dock */}
        <button
          className="nav-search-dock"
          onClick={() => onSearchOpen?.()}
          aria-label="Quick search — press Command+K or Control+K"
        >
          <svg className="nav-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="nav-search-text">Search states, data…</span>
          <span className="nav-search-kbd">⌘K</span>
        </button>

        {/* Right controls */}
        <div className="nav-right">
          {/* Role switcher */}
          <div className="role-switcher">
            <button
              className="role-btn"
              onClick={() => {
                setRoleMenuOpen((v) => !v);
                setPinMenuOpen(false);
              }}
              aria-expanded={roleMenuOpen}
              aria-label="Switch role"
            >
              <span className="role-btn-active">
                {activeRole.icon} {activeRole.label}
              </span>
              <span className="role-btn-caret" />
            </button>
            {roleMenuOpen && (
              <div className="role-menu" role="menu">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    className={`role-option${activeRole.id === r.id ? " active" : ""}`}
                    onClick={() => {
                      setActiveRole(r);
                      setRoleMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pin district */}
          <div className="pin-dropdown" style={{ position: "relative" }}>
            <button
              className={`pin-btn${pinnedDistrict ? " pinned" : ""}`}
              onClick={() => {
                setPinMenuOpen((v) => !v);
                setRoleMenuOpen(false);
              }}
              aria-expanded={pinMenuOpen}
              aria-label="Set as My Home District"
            >
              <svg className="pin-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M10 2C6.686 2 4 4.686 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                  fill="currentColor"
                />
              </svg>
              {pinnedDistrict
                ? PIN_DISTRICTS.find((d) => d.id === pinnedDistrict)?.name
                : "Pin District"}
            </button>
            {pinMenuOpen && (
              <div className="role-menu" role="menu" style={{ minWidth: 170 }}>
                <div
                  style={{
                    padding: ".2rem .6rem",
                    fontSize: ".62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    color: "var(--color-ink-4-light)",
                  }}
                >
                  My Home District
                </div>
                {PIN_DISTRICTS.map((d) => (
                  <button
                    key={d.id}
                    className={`role-option${pinnedDistrict === d.id ? " active" : ""}`}
                    onClick={() => {
                      setPinnedDistrict(pinnedDistrict === d.id ? null : d.id);
                      setPinMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Official CTA */}
          <a
            href="https://censusindia.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="official-cta"
            aria-label="Official Census portal (opens in new tab)"
          >
            Official Portal ↗
          </a>

          {/* Mobile toggle */}
          <button
            id="nav-menu-toggle"
            className="mobile-toggle"
            onClick={() => setMenuOpen((v) => !v)}
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
        <div id="mobile-menu" className="container mobile-menu" role="menu">
          {[
            { to: "/dates", label: "📅 Dates" },
            { to: "/wizard", label: "🧭 Wizard" },
            { to: "/chat", label: "💬 Chat" },
            { to: "/privacy", label: "🔒 Privacy" },
            { to: "/viz", label: "📊 Data" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
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
            style={{ color: "var(--color-terracotta)" }}
            onClick={() => setMenuOpen(false)}
          >
            Official Portal ↗
          </a>
        </div>
      )}
    </header>
  );
}
