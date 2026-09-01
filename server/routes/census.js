import { Router } from "express";
import { getNationalData, getStateData, censusStatus } from "../census.js";

// ────────────────────────────────────────────────────────────
// /api/census — census data endpoints
// ────────────────────────────────────────────────────────────
const router = Router();

router.get("/national", async (req, res) => {
  try {
    const data = await getNationalData({ force: req.query.force === "true" });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/states", async (req, res) => {
  try {
    const data = await getStateData({ force: req.query.force === "true" });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/status", (req, res) => {
  res.json({ ok: true, ...censusStatus() });
});

export default router;