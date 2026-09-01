// ────────────────────────────────────────────────────────────
// validate.js — strict server-side input validation & sanitization
// for all incoming API payloads. Every field is bounds-checked and
// type-checked so no malformed payload reaches business logic.
// ────────────────────────────────────────────────────────────

export const MAX_QUESTION_LENGTH = 1000;
export const MAX_HISTORY_TURNS = 20;
export const MAX_HISTORY_TEXT_LENGTH = 4000;

const VALID_ROLES = new Set(["user", "assistant"]);

/**
 * Validate + normalize a chat request body.
 * @param {{question?: unknown, history?: unknown}} body
 * @param {Array} history - defaults to []
 * @returns {{ ok: true, question: string, history: Array<{role:string,text:string}> } | { ok: false, error: string }}
 */
export function validateChatRequest(body) {
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    return { ok: false, error: "`question` is required." };
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return {
      ok: false,
      error: `\`question\` must be at most ${MAX_QUESTION_LENGTH} characters.`,
    };
  }

  let history = [];
  if (body?.history !== undefined && body?.history !== null) {
    if (!Array.isArray(body.history)) {
      return { ok: false, error: "`history` must be an array of {role, text}." };
    }
    for (const turn of body.history) {
      if (
        typeof turn !== "object" ||
        turn === null ||
        !VALID_ROLES.has(turn.role) ||
        typeof turn.text !== "string"
      ) {
        return { ok: false, error: "`history` entries must be {role: 'user'|'assistant', text: string}." };
      }
      const text = turn.text.trim();
      if (text.length > MAX_HISTORY_TEXT_LENGTH) {
        return { ok: false, error: `History text exceeds ${MAX_HISTORY_TEXT_LENGTH} characters.` };
      }
      history.push({ role: turn.role, text });
    }
    if (history.length > MAX_HISTORY_TURNS) {
      history = history.slice(-MAX_HISTORY_TURNS);
    }
  }

  return { ok: true, question, history };
}

/**
 * Validate the `force` querystring flag (only the literal string "true" counts).
 * @param {unknown} value
 * @returns {boolean}
 */
export function parseForceFlag(value) {
  return value === "true";
}

/**
 * Reject any unexpected query params (strict schema).
 * @param {import("express").Request} req
 * @param {string[]} allowed
 * @returns {null | string}
 */
export function validateQueryParams(req, allowed = []) {
  const extra = Object.keys(req.query || {}).filter((k) => !allowed.includes(k));
  if (extra.length) {
    return `Unexpected query parameter(s): ${extra.join(", ")}`;
  }
  return null;
}

// ────────────────────────────────────────────────────────────
// Centralized error mapping (typed error boundaries)
// ────────────────────────────────────────────────────────────

export class ValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
  }
}

export function errorStatus(err) {
  if (err instanceof ValidationError) return err.status;
  if (/Gemini error|config/i.test(err.message || "")) return 502;
  return 500;
}