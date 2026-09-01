import { Router } from "express";
import rateLimit from "express-rate-limit";
import { answerQuestion } from "../rag.js";
import {
  validateChatRequest,
  validateQueryParams,
  errorStatus,
} from "../validate.js";

// ────────────────────────────────────────────────────────────
// /api/chat — RAG chatbot endpoint (grounded in census corpus)
// Hardened: strict body validation, generous-but-bounded rate
// limit, and distributed latency limits in dev only.
// ────────────────────────────────────────────────────────────
const router = Router();

// 60 requests / IP / 15 min (interactive chatbot; prevents abuse).
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many chat requests. Please slow down and try again." },
});

router.get("/status", (req, res) => {
  const error = validateQueryParams(req);
  if (error) return res.status(400).json({ ok: false, error });
  res.json({ ok: true, rateLimit: "60 / 15 min / IP" });
});

router.post("/", chatLimiter, async (req, res) => {
  const parsed = validateChatRequest(req.body);
  if (!parsed.ok) {
    return res.status(400).json({ ok: false, error: parsed.error });
  }

  try {
    const { question, history } = parsed;
    const result = await answerQuestion(question, history);
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(errorStatus(err)).json({ ok: false, error: err.message });
  }
});

router.all("/", (req, res) => {
  if (req.method === "OPTIONS") return res.status(204).end();
  res.status(405).json({ ok: false, error: "Method not allowed." });
});

export default router;