/**
 * pii-guard.js — Client-side PII detection
 *
 * Replaces Cloud DLP API with in-browser regex + checksum scanning.
 * Values are NEVER logged, transmitted, or stored — only flagged.
 *
 * Patterns covered:
 *  - Aadhaar numbers (12-digit, with Verhoeff checksum)
 *  - Voter ID (ECI format: 3 alpha + 7 alphanum)
 *  - Indian Passport (1 alpha + 7 digits)
 *  - PAN card (5 alpha + 4 digit + 1 alpha)
 */

// ── Verhoeff checksum tables for Aadhaar validation ─────────────
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];
const VERHOEFF_INV = [0, 4, 3, 2, 1, 9, 8, 7, 6, 5];

/**
 * Validates an Aadhaar number using the Verhoeff algorithm.
 * @param {string} num - 12-digit string (digits only)
 * @returns {boolean}
 */
function verhoeffCheck(num) {
  let c = 0;
  const digits = num.split("").reverse().map(Number);
  for (let i = 0; i < digits.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digits[i]]];
  }
  return c === 0;
}

// ── Regex patterns ───────────────────────────────────────────────
const PATTERNS = {
  aadhaar: /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
  voterId: /\b[A-Z]{3}[0-9]{7}\b/g,
  // Indian passport: 1 alpha + 7 digits (8 chars total, e.g. B1234567)
  passport: /\b[A-Z]\d{7}\b/g,
  pan: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g,
};

/**
 * Scans text for PII patterns.
 * @param {string} text
 * @returns {{ hasPii: boolean, types: string[], sanitized: string }}
 */
export function scanForPii(text) {
  if (!text || typeof text !== "string") {
    return { hasPii: false, types: [], sanitized: text };
  }

  const found = [];
  let sanitized = text;

  // Check Aadhaar (with checksum validation)
  const aadhaarMatches = text.matchAll(PATTERNS.aadhaar);
  for (const match of aadhaarMatches) {
    const digits = match[0].replace(/\s/g, "");
    if (verhoeffCheck(digits)) {
      found.push("aadhaar");
      // Mask: show only last 4
      sanitized = sanitized.replace(match[0], `XXXX XXXX ${digits.slice(-4)}`);
    }
  }

  // Check Voter ID
  if (PATTERNS.voterId.test(text)) {
    found.push("voter_id");
    sanitized = sanitized.replace(PATTERNS.voterId, "[VOTER-ID REDACTED]");
  }

  // Check Passport
  if (PATTERNS.passport.test(text)) {
    found.push("passport");
    sanitized = sanitized.replace(PATTERNS.passport, "[PASSPORT REDACTED]");
  }

  // Check PAN
  if (PATTERNS.pan.test(text)) {
    found.push("pan");
    sanitized = sanitized.replace(PATTERNS.pan, "[PAN REDACTED]");
  }

  // Reset regex lastIndex (stateful with /g flag)
  Object.values(PATTERNS).forEach((p) => {
    p.lastIndex = 0;
  });

  const hasPii = found.length > 0;
  if (hasPii) {
    // Log warning without logging the value
    console.warn(`[PII-Guard] Detected PII type(s): ${found.join(", ")} — value NOT logged.`);
  }

  return { hasPii, types: found, sanitized };
}

/**
 * Validates Aadhaar format + checksum client-side only.
 * Value should be cleared from memory after calling this.
 * @param {string} value
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateAadhaarFormat(value) {
  const digits = value.replace(/\s/g, "");
  if (!/^\d{12}$/.test(digits)) {
    return { valid: false, error: "Aadhaar must be exactly 12 digits." };
  }
  if (digits[0] === "0" || digits[0] === "1") {
    return { valid: false, error: "Aadhaar cannot start with 0 or 1." };
  }
  if (!verhoeffCheck(digits)) {
    return { valid: false, error: "Aadhaar checksum is invalid." };
  }
  return { valid: true, error: null };
}

/**
 * Validates Indian Voter ID format.
 * @param {string} value
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateVoterIdFormat(value) {
  const v = value.toUpperCase().trim();
  if (!/^[A-Z]{3}[0-9]{7}$/.test(v)) {
    return {
      valid: false,
      error: "Voter ID must be 3 letters followed by 7 digits (e.g., ABC1234567).",
    };
  }
  return { valid: true, error: null };
}
