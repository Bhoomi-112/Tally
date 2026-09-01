import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { config } from "./config.js";

// ────────────────────────────────────────────────────────────
// server/firebase.js — lazily initializes the Firebase Admin SDK
// from the git-ignored service account JSON when present.
// ────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, "firebase-service-account.json");

let app = null;

function loadServiceAccount() {
  if (config.firebase.serviceAccount) return config.firebase.serviceAccount;
  if (!fs.existsSync(serviceAccountPath)) return null;
  // TODO: cache parsed JSON to avoid re-reading per request
  return JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

export function getFirebaseApp() {
  if (app) return app; // already initialized
  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) return null;
  app = admin.initializeApp({
    credential: admin.cert(serviceAccount),
    ...(config.firebase.projectId ? { projectId: config.firebase.projectId } : {}),
  });
  return app;
}

export function isFirebaseAdminAvailable() {
  return !!loadServiceAccount();
}

export function getAdminAuth() {
  const firebaseApp = getFirebaseApp();
  return firebaseApp ? getAuth(firebaseApp) : null;
}

/**
 * Express middleware that validates a Firebase ID Token from the
 * Authorization header ("Bearer <token>"). Attaches the verified
 * user as req.user; otherwise responds 401.
 */
export async function requireAuth(req, res, next) {
  const auth = getAdminAuth();
  if (!auth) {
    return res.status(503).json({ ok: false, error: "Firebase admin not configured." });
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, error: "Missing bearer token." });
  }
  try {
    req.user = await auth.verifyIdToken(token);
    next();
  } catch (err) {
    res.status(401).json({ ok: false, error: "Invalid or expired token." });
  }
}