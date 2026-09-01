import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import censusRouter from "./routes/census.js";
import chatRouter from "./routes/chat.js";
import authRouter from "./routes/auth.js";

// ────────────────────────────────────────────────────────────
// server.js — Tally API backend (Express)
// Routes are mounted under /api and proxied from Vite in dev.
// ────────────────────────────────────────────────────────────

const app = express();

app.set("trust proxy", config.trustProxy);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: config.corsOrigin === "*" ? "*" : config.corsOrigin.split(",").map((s) => s.trim()),
  })
);
app.use(express.json({ limit: "64kb" }));

// Request logger (dev)
if (config.nodeEnv !== "production") {
  app.use((req, res, next) => {
    const t = Date.now();
    res.on("finish", () => {
      console.log(`[api] ${req.method} ${req.originalUrl} ${res.statusCode} (${Date.now() - t}ms)`);
    });
    next();
  });
}

// Health
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "tally-api", nodeEnv: config.nodeEnv });
});

// Feature routes
app.use("/api/census", censusRouter);
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);

// 404 for unknown api routes
app.use("/api", (_req, res) => {
  res.status(404).json({ ok: false, error: "Unknown API route." });
});

// Central error handler (never leaks stack traces)
app.use((err, _req, res, _next) => {
  console.error("[api] error:", err.message);
  res.status(err.status || 500).json({ ok: false, error: "Internal server error." });
});

// Start only when run directly (not when imported for tests)
const isMain = process.argv[1] && process.argv[1].endsWith("server.js");
if (isMain) {
  app.listen(config.port, () => {
    console.log(`Tally API listening on http://localhost:${config.port}`);
  });
}

export { app };