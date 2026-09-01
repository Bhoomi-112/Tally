import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import censusData from "../modules/dates/data/census-dates.json";

const SEARCH_ITEMS = [
  { icon: "📅", label: "Census Dates — All States", meta: "Dates", to: "/dates" },
  { icon: "🧭", label: "Enumeration Wizard", meta: "Wizard", to: "/wizard" },
  { icon: "📊", label: "Dashboard Overview", meta: "Home", to: "/" },
  ...censusData.states.slice(0, 12).map(s => ({
    icon: "🗺️", label: s.name, meta: s.region, to: `/dates#state-card-${s.id}`,
  })),
];

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_ITEMS;

  const handleSelect = useCallback((item) => {
    onClose();
    setQuery("");
    navigate(item.to.split("#")[0]);
  }, [navigate, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sp-search-overlay" onClick={onClose} role="dialog" aria-label="Quick search" aria-modal="true">
      <div className="sp-search-modal" onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className="sp-search-input-row">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            autoFocus
            className="sp-search-field"
            placeholder="Search states, modules, data…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && filtered[0]) handleSelect(filtered[0]); }}
          />
          <span style={{ fontSize: ".7rem", color: "#334155" }}>ESC</span>
        </div>

        {/* Results */}
        <div className="sp-search-results">
          <div className="sp-search-section">
            <div className="sp-search-section-label">
              {query ? `Results for "${query}"` : "Quick access"}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: "1.25rem 1rem", fontSize: ".8125rem", color: "#334155", textAlign: "center" }}>
                No results found
              </div>
            )}
            {filtered.slice(0, 8).map((item, i) => (
              <button key={i} className="sp-search-item" style={{ width: "100%", textAlign: "left" }} onClick={() => handleSelect(item)}>
                <span className="sp-search-item-icon">{item.icon}</span>
                {item.label}
                <span className="sp-search-item-meta">{item.meta}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sp-search-footer">
          <span className="sp-search-shortcut">
            <kbd className="sp-search-kbd-sm">↵</kbd> Select
          </span>
          <span className="sp-search-shortcut">
            <kbd className="sp-search-kbd-sm">ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
