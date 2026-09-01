const API = "/api";

// ────────────────────────────────────────────────────────────
// api.js — thin wrapper around the Express backend.
// Used by all frontend components.
// ────────────────────────────────────────────────────────────

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(path) {
  const res = await fetch(`${API}${path}`);
  return res.json();
}

// ── Census ────────────────────────────────────────────────

export function fetchNationalCensus(force = false) {
  return get(`/census/national${force ? "?force=true" : ""}`);
}

export function fetchStatesCensus(force = false) {
  return get(`/census/states${force ? "?force=true" : ""}`);
}

export function fetchCensusStatus() {
  return get("/census/status");
}

// ── RAG Chat ──────────────────────────────────────────────

export function chatWithTally(question, history = []) {
  return post("/chat", { question, history });
}

// ── Health ────────────────────────────────────────────────

export function healthCheck() {
  return get("/health");
}
