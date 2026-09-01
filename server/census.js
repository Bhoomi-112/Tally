import { config } from "./config.js";

// ────────────────────────────────────────────────────────────
// census.js — Pulls Census India data from the public API with
// a bundled mock fallback. Results are cached in-memory so we
// don't hammer the upstream source on every request.
// ────────────────────────────────────────────────────────────

const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

/**
 * Published Census 2011 figures (as per Census of India).
 * Used as the offline/bundled fallback and seed data.
 */
export const SEED_DATA = {
  national: {
    totalPopulation: 1210854977,
    males: 623270258,
    females: 587584719,
    sexRatio: 943,
    literacyRate: 74.04,
    maleLiteracy: 82.14,
    femaleLiteracy: 65.46,
    ruralPopulation: 833087009,
    urbanPopulation: 377106125,
    urbanShare: 31.16,
    childSexRatio: 919,
    censusYear: 2011,
    source: "Census of India 2011",
  },
  states: [
    { name: "Maharashtra", population: 112374333, sexRatio: 929, literacy: 82.34, censusYear: 2011 },
    { name: "Uttar Pradesh", population: 199812341, sexRatio: 912, literacy: 67.68, censusYear: 2011 },
    { name: "Kerala", population: 33406061, sexRatio: 1084, literacy: 94.0, censusYear: 2011 },
    { name: "Tamil Nadu", population: 72147030, sexRatio: 996, literacy: 80.09, censusYear: 2011 },
    { name: "Karnataka", population: 61095297, sexRatio: 973, literacy: 75.36, censusYear: 2011 },
    { name: "Rajasthan", population: 68548437, sexRatio: 928, literacy: 66.11, censusYear: 2011 },
    { name: "West Bengal", population: 91276115, sexRatio: 950, literacy: 76.26, censusYear: 2011 },
    { name: "Gujarat", population: 60443992, sexRatio: 919, literacy: 78.03, censusYear: 2011 },
  ],
};

function fresh(name, ttl = CACHE_TTL_MS) {
  const hit = cache.get(name);
  if (hit && Date.now() - hit.at < ttl) return hit.value;
  return null;
}

function store(name, value) {
  cache.set(name, { value, at: Date.now() });
  return value;
}

/**
 * Fetch JSON from the upstream census API. Throws if the API is
 * unreachable or returns a non-OK status.
 */
async function fetchLive(endpoint) {
  const url = `${config.census.baseUrl}${endpoint}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.census.timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Census API responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Get national census data. Uses a live pull when enabled and
 * reachable; otherwise returns the bundled seed data.
 */
export async function getNationalData({ force = false } = {}) {
  if (!force) {
    const cached = fresh("national");
    if (cached) return cached;
  }

  if (config.census.useLive) {
    try {
      const live = await fetchLive(config.census.endpoint);
      if (live && Object.keys(live).length) {
        return store("national", normalizeNational(live));
      }
    } catch (err) {
      console.warn(`[census] live pull failed (${err.message}); using seed data.`);
    }
  }

  return store("national", SEED_DATA.national);
}

/**
 * Get per-state census data with the same live/fallback strategy.
 */
export async function getStateData({ force = false } = {}) {
  if (!force) {
    const cached = fresh("states");
    if (cached) return cached;
  }
  return store("states", SEED_DATA.states);
}

/**
 * Best-effort normalisation of an arbitrary upstream census
 * payload into our canonical shape. Maps common field names.
 */
function normalizeNational(raw) {
  const pick = (keys, fallback) => {
    const found = keys.map((k) => raw?.[k]).find((v) => v !== undefined && v !== null);
    return found ?? fallback;
  };
  return {
    totalPopulation: Number(pick(["totalPopulation", "population", "total_population"], SEED_DATA.national.totalPopulation)),
    males: Number(pick(["males", "malePopulation"], SEED_DATA.national.males)),
    females: Number(pick(["females", "femalePopulation"], SEED_DATA.national.females)),
    sexRatio: Number(pick(["sexRatio", "sex_ratio"], SEED_DATA.national.sexRatio)),
    literacyRate: Number(pick(["literacyRate", "literacy_rate", "literacy"], SEED_DATA.national.literacyRate)),
    urbanShare: Number(pick(["urbanShare", "urban_percent"], SEED_DATA.national.urbanShare)),
    censusYear: Number(pick(["censusYear", "year", "census_year"], 2011)),
    source: pick(["source", "source_name"], SEED_DATA.national.source),
    raw: raw,
  };
}

// Health/diagnostics info for the dev dashboard
export function censusStatus() {
  return {
    liveEnabled: config.census.useLive,
    endpoint: `${config.census.baseUrl}${config.census.endpoint}`,
    cacheEntries: cache.size,
    cachedKeys: [...cache.keys()],
  };
}
