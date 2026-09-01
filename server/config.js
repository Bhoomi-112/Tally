import "dotenv/config";

// ────────────────────────────────────────────────────────────
// Server configuration — reads env vars with sensible defaults.
// Uses VITE_ prefixed vars so the same .env drives client and
// server (Vite exposes VITE_* to the browser bundle safely).
// ────────────────────────────────────────────────────────────

const env = process.env;

export const config = {
  port: Number(env.PORT || env.VITE_PORT || 8787),
  nodeEnv: env.NODE_ENV || "development",

  gemini: {
    apiKey: env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || "",
    model: env.GEMINI_MODEL || "gemini-2.0-flash",
    embeddingModel: env.GEMINI_EMBEDDING_MODEL || "text-embedding-004",
  },

  census: {
    baseUrl: env.CENSUS_API_URL || "https://api.census.gov.in/api",
    endpoint: env.CENSUS_ENDPOINT || "/data",
    timeoutMs: Number(env.CENSUS_TIMEOUT_MS || 12000),
    useLive: env.CENSUS_USE_LIVE !== "false",
  },

  firebase: {
    projectId: env.GAE_SERVICE || env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID || "",
  },

  corsOrigin: env.CORS_ORIGIN || "*",
};
