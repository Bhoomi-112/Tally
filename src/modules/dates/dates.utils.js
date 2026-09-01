/**
 * Utility functions for the dates module.
 * All logic is deterministic — no AI, no network.
 */

/**
 * Formats a date string (YYYY-MM-DD) to a human-readable locale string.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr + "T00:00:00"); // avoid UTC offset issues
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns the status of a phase based on today's date.
 * @param {string} start - YYYY-MM-DD
 * @param {string} end - YYYY-MM-DD
 * @returns {"upcoming" | "active" | "completed"}
 */
export function getPhaseStatus(start, end) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");

  if (today < s) return "upcoming";
  if (today > e) return "completed";
  return "active";
}

/**
 * Returns a label and colour class for a phase status.
 * @param {"upcoming" | "active" | "completed"} status
 */
export function getStatusMeta(status) {
  switch (status) {
    case "active":
      return { label: "Active Now", className: "badge-completed" };
    case "completed":
      return { label: "Completed", className: "badge bg-slate-500/20 text-slate-300 border border-slate-500/30" };
    case "upcoming":
    default:
      return { label: "Upcoming", className: "badge-provisional" };
  }
}

/**
 * Looks up a single state by its ID.
 * @param {import('./data/census-dates.json')} data
 * @param {string} id
 */
export function getStateById(data, id) {
  return data.states.find((s) => s.id === id) ?? null;
}

/**
 * Filters states by search query (name or region).
 * @param {Array} states
 * @param {string} query
 */
export function filterStates(states, query) {
  if (!query.trim()) return states;
  const q = query.toLowerCase();
  return states.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.region.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
  );
}

/**
 * Groups states by region.
 * @param {Array} states
 * @returns {Record<string, Array>}
 */
export function groupByRegion(states) {
  return states.reduce((acc, state) => {
    if (!acc[state.region]) acc[state.region] = [];
    acc[state.region].push(state);
    return acc;
  }, {});
}
