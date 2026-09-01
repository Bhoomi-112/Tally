import { Router } from "express";
import { answerQuestion } from "../rag.js";

// ────────────────────────────────────────────────────────────
// /api/chat — RAG chatbot endpoint (grounded in census corpus)
// ────────────────────────────────────────────────────────────
const router = Router();

router.post("/", async (req, res) => {
  const question = req.body?.question?.trim();
  const history = req.body?.history;

  if (!question) {
    return res.status(400).json({ ok: false, error: "`question` is required." });
  }

  try {
    const result = await answerQuestion(question, history);
    res.json({ ok: true, ...result });
  } catch (err) {
    const status = /Gemini error|config/i.test(err.message || "") ? 502 : 500;
    res.status(status).json({ ok: false, error: err.message });
  }
});

export default router;