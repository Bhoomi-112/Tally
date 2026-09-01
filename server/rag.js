import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./config.js";
import { retrieve, toContext } from "./knowledge.js";

// ────────────────────────────────────────────────────────────
// rag.js — Retrieval-Augmented Generation over the census
// corpus using Google Gemini. Retrieves relevant chunks and
// grounds the model's answer in them.
// ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Tally, a precise Census intelligence assistant for the Government of India's Census programme.
Answer ONLY using the provided context. If the context does not contain the answer, say you don't have that information and suggest the user check censusindia.gov.in.
Quote exact figures when available. Keep answers concise, factual, and institutional in tone. Never invent data.`;

function getGenAI() {
  if (!config.gemini.apiKey) {
    throw new Error(
      "Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env.local (https://aistudio.google.com)."
    );
  }
  return new GoogleGenerativeAI(config.gemini.apiKey);
}

/**
 * Answer a question grounded in the census corpus.
 * @param {string} question - The user's query
 * @param {Array} [history] - Prior {role, parts} messages for multi-turn context
 * @returns {Promise<{ answer: string, sources: Array<number>, context: string }>}
 */
export async function answerQuestion(question, history = []) {
  const matches = retrieve(question);
  const context = toContext(matches);
  const sourceIds = matches.map((m) => m.doc.id);

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: config.gemini.model,
    systemInstruction: SYSTEM_PROMPT,
  });

  const historyParts = (history || [])
    .filter((m) => m?.role && m?.text)
    .slice(-8)
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] }));

  const chat = model.startChat({
    history: historyParts.length ? historyParts : undefined,
    generationConfig: { temperature: 0.3 },
  });

  const prompt = `CONTEXT:\n${context || "(no relevant context retrieved)"}\n\nQUESTION: ${question}\n\nAnswer using only the context above.`;

  try {
    const result = await chat.sendMessage(prompt);
    const text = result.response.text();
    return { answer: text.trim(), sources: sourceIds, context };
  } catch (err) {
    // Distinguish config vs API errors
    if (/API key|permission|quota|429/i.test(err.message || "")) {
      throw new Error(`Gemini error: ${err.message}`);
    }
    throw err;
  }
}

/**
 * Simple embedding of a string to a numeric vector using the
 * Gemini embedding API (used when a vector store is wired in).
 * @returns {Promise<number[]>}
 */
export async function embed(text) {
  const genAI = getGenAI();
  const result = await genAI.getGenerativeModel({
    model: config.gemini.embeddingModel,
  });
  const res = await result.embedContent(text);
  return res.embedding.values;
}