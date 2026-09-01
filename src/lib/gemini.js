/**
 * gemini.js — Free-tier Gemini API client wrapper
 *
 * Uses @google/generative-ai SDK with gemini-2.0-flash (free tier).
 * All inputs are scanned by pii-guard before reaching the API.
 * Rate limit: 15 RPM on the free tier — enforced by a simple queue.
 *
 * IMPORTANT: This module is a placeholder for modules 3+ (chatbot, privacy).
 * The dates/ module does NOT use this.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { scanForPii } from "./pii-guard.js";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Free-tier model
const MODEL_NAME = "gemini-2.0-flash";

// Simple rate-limit queue (15 RPM = 1 request per 4 seconds)
const MIN_INTERVAL_MS = 4000;
let lastCallTime = 0;

function waitForRateLimit() {
  return new Promise((resolve) => {
    const now = Date.now();
    const wait = Math.max(0, MIN_INTERVAL_MS - (now - lastCallTime));
    setTimeout(() => {
      lastCallTime = Date.now();
      resolve();
    }, wait);
  });
}

/**
 * Creates and returns a Gemini generative model instance.
 * Throws if API key is not configured.
 */
function getModel(systemInstruction) {
  if (!API_KEY) {
    throw new Error(
      "Gemini API key not configured. Copy .env.example to .env.local and add your key from https://aistudio.google.com"
    );
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemInstruction || undefined,
  });
}

/**
 * Sends a prompt to Gemini after PII scanning.
 * @param {string} prompt - User input
 * @param {string} [systemInstruction] - System context for the model
 * @returns {Promise<{ text: string, piiDetected: boolean }>}
 */
export async function ask(prompt, systemInstruction) {
  // 1. PII gate — scan before sending to any external service
  const { hasPii, types, sanitized } = scanForPii(prompt);
  if (hasPii) {
    console.warn(`[Gemini] PII (${types.join(", ")}) detected and sanitized before API call.`);
  }

  // 2. Rate limit
  await waitForRateLimit();

  // 3. Call API with sanitized input
  const model = getModel(systemInstruction);
  const result = await model.generateContent(sanitized);
  const text = result.response.text();

  return { text, piiDetected: hasPii };
}

/**
 * Starts a chat session.
 * @param {string} [systemInstruction]
 * @param {Array} [history] - Prior messages
 * @returns {object} Chat session with `sendMessage(prompt)` method
 */
export function startChat(systemInstruction, history = []) {
  const model = getModel(systemInstruction);
  const chat = model.startChat({ history });

  return {
    async sendMessage(prompt) {
      const { hasPii, types, sanitized } = scanForPii(prompt);
      if (hasPii) {
        console.warn(`[Gemini Chat] PII (${types.join(", ")}) sanitized before sending.`);
      }
      await waitForRateLimit();
      const result = await chat.sendMessage(sanitized);
      return { text: result.response.text(), piiDetected: hasPii };
    },
  };
}
