import { useCallback, useRef } from "react";

// ────────────────────────────────────────────────────────────
// useCursorSpotlight — applies a radial-accent gradient overlay
// that tracks the mouse inside a panel, exposed via a CSS var
// pair. Returns ref + onMouseMove handler.
// ────────────────────────────────────────────────────────────
export function useCursorSpotlight() {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return { ref, onMouseMove };
}

// Format a numeric population with Indian grouping (lakhs hint)
export function formatPopulation(value) {
  if (value >= 1e7) return `${(value / 1e7).toFixed(1)} cr`;
  if (value >= 1e5) return `${(value / 1e5).toFixed(1)} lakh`;
  return value.toLocaleString("en-IN");
}

export function formatCompact(value) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatComma(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

// Accent color by metric accent key
export const ACCENTS = {
  terracotta: "#E06D53",
  sage: "#7D9D8B",
  amber: "#E5A95D",
  steel: "#6B8DA6",
};

export const ACCENT_BG = {
  terracotta: "rgba(224,109,83,0.12)",
  sage: "rgba(125,157,139,0.12)",
  amber: "rgba(229,169,93,0.12)",
  steel: "rgba(107,141,166,0.12)",
};
