import { describe, it, expect } from "vitest";
import {
  validateChatRequest,
  parseForceFlag,
  validateQueryParams,
  errorStatus,
  ValidationError,
  MAX_QUESTION_LENGTH,
} from "../../server/validate.js";

// ────────────────────────────────────────────────────────────
// server/validate.js — pure input-validation unit tests
// ────────────────────────────────────────────────────────────

describe("validateChatRequest", () => {
  it("rejects empty or whitespace questions", () => {
    for (const bad of [undefined, null, "", "   ", 42, {}, []]) {
      const r = validateChatRequest({ question: bad });
      expect(r.ok).toBe(false);
    }
  });

  it("trims and returns a valid question", () => {
    const r = validateChatRequest({ question: "  hello  " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.question).toBe("hello");
  });

  it("rejects oversized questions", () => {
    const r = validateChatRequest({ question: "a".repeat(MAX_QUESTION_LENGTH + 1) });
    expect(r.ok).toBe(false);
  });

  it("rejects non-array history", () => {
    const r = validateChatRequest({ question: "q", history: "nope" });
    expect(r.ok).toBe(false);
  });

  it("rejects history entries with invalid roles or shapes", () => {
    const cases = [
      [{ role: "system", text: "x" }],
      [{ role: "user" }],
      [{ text: 3 }],
      ["user"],
    ];
    for (const history of cases) {
      const r = validateChatRequest({ question: "q", history });
      expect(r.ok).toBe(false);
    }
  });

  it("accepts valid history and trims its text", () => {
    const r = validateChatRequest({
      question: "q",
      history: [{ role: "user", text: "  a  " }, { role: "assistant", text: "b" }],
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.history[0].text).toBe("a");
  });

  it("caps history at the max turn count", () => {
    const r = validateChatRequest({
      question: "q",
      history: Array.from({ length: 50 }, (_, i) => ({ role: "user", text: `t${i}` })),
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.history.length).toBe(20);
  });
});

describe("parseForceFlag", () => {
  it("only treats the literal 'true' as truthy", () => {
    expect(parseForceFlag("true")).toBe(true);
    expect(parseForceFlag("false")).toBe(false);
    expect(parseForceFlag(undefined)).toBe(false);
    expect(parseForceFlag(1)).toBe(false);
    expect(parseForceFlag("TRUE")).toBe(false);
  });
});

describe("validateQueryParams", () => {
  it("rejects unexpected params and allows the listed ones", () => {
    expect(validateQueryParams({ query: {} }, ["force"])).toBeNull();
    expect(validateQueryParams({ query: { force: "true" } }, ["force"])).toBeNull();
    expect(validateQueryParams({ query: { evil: "1" } }, ["force"])).toMatch(/evil/);
  });
});

describe("errorStatus", () => {
  it("maps typed and known errors", () => {
    expect(errorStatus(new ValidationError("bad", 400))).toBe(400);
    expect(errorStatus(new Error("Gemini error: quota"))).toBe(502);
    expect(errorStatus(new Error("boom"))).toBe(500);
  });
});