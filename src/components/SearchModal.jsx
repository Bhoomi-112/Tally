import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import censusData from "../modules/dates/data/census-dates.json";

export default function SearchModal({ open, onClose }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const SEARCH_ITEMS = [
    { icon: "📊", label: t("search.dashboard"), meta: t("search.home"), to: "/" },
    { icon: "📅", label: t("search.allDates"), meta: t("nav.dates"), to: "/dates" },
    { icon: "🧭", label: t("search.wizardModule"), meta: t("nav.wizard"), to: "/wizard" },
    ...censusData.states.map((s) => ({
      icon: "🗺️",
      label: s.name,
      meta: s.region,
      to: `/dates#state-card-${s.id}`,
    })),
  ];

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_ITEMS;

  const handleSelect = useCallback(
    (item) => {
      onClose();
      setQuery("");
      const [path] = item.to.split("#");
      navigate(path);
    },
    [navigate, onClose]
  );

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="search-overlay"
      onClick={handleClose}
      role="dialog"
      aria-label={t("search.label")}
      aria-modal="true"
    >
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="#6F7680"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            className="search-field"
            placeholder={t("search.placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered[0]) handleSelect(filtered[0]);
            }}
          />
          <span className="search-esc-hint">ESC</span>
        </div>

        <div className="search-results">
          {filtered.length > 0 ? (
            <div className="search-section">
              <div className="search-section-label">
                {query ? t("search.resultsFor", { query }) : t("search.quickAccess")}
              </div>
              {filtered.slice(0, 10).map((item, i) => (
                <button key={i} className="search-item" onClick={() => handleSelect(item)}>
                  <span className="search-item-icon">{item.icon}</span>
                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>
                  <span className="search-item-meta">{item.meta}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="search-rec">{t("search.noResults")}</div>
          )}
        </div>

        <div className="search-footer">
          <span className="search-shortcut">
            <kbd className="kbd">↵</kbd> {t("search.select")}
          </span>
          <span className="search-shortcut">
            <kbd className="kbd">ESC</kbd> {t("search.close")}
          </span>
        </div>
      </div>
    </div>
  );
}
