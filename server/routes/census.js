import { Router } from "express";
import { getNationalData, getStateData, censusStatus } from "../census.js";
import { parseForceFlag, validateQueryParams, errorStatus } from "../validate.js";

// ────────────────────────────────────────────────────────────
// /api/census — census data endpoints
// Hardened: strict query-schema validation; every param is
// inspected and only the literal "true" enables a live refresh.
// ────────────────────────────────────────────────────────────
const router = Router();

router.get("/national", async (req, res) => {
  const qError = validateQueryParams(req, ["force"]);
  if (qError) return res.status(400).json({ ok: false, error: qError });
  try {
    const data = await getNationalData({ force: parseForceFlag(req.query.force) });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(errorStatus(err)).json({ ok: false, error: err.message });
  }
});

router.get("/states", async (req, res) => {
  const qError = validateQueryParams(req, ["force"]);
  if (qError) return res.status(400).json({ ok: false, error: qError });
  try {
    const data = await getStateData({ force: parseForceFlag(req.query.force) });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(errorStatus(err)).json({ ok: false, error: err.message });
  }
});

router.get("/status", (req, res) => {
  const qError = validateQueryParams(req);
  if (qError) return res.status(400).json({ ok: false, error: qError });
  res.json({ ok: true, ...censusStatus() });
});

export default router;