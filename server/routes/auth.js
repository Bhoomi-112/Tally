import { Router } from "express";
import { requireAuth, isFirebaseAdminAvailable } from "../firebase.js";

// ────────────────────────────────────────────────────────────
// routes/auth.js — Firebase token verification + profile status
// ────────────────────────────────────────────────────────────

const router = Router();

// Whether the backend has Firebase admin configured (for UI hints).
router.get("/status", (_req, res) => {
  res.json({ ok: true, configured: isFirebaseAdminAvailable() });
});

// Verify a client Firebase ID token and return the user payload.
router.get("/verify", requireAuth, (req, res) => {
  res.json({
    ok: true,
    user: {
      uid: req.user.uid,
      email: req.user.email || null,
      name: req.user.name || null,
    },
  });
});

export default router;