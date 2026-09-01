import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// ────────────────────────────────────────────────────────────
// Firebase client SDK — reads VITE_FIREBASE_* env vars that
// are safe to expose in the browser (Firebase web config is
// designed to be public; security rules control access).
// ────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;

function ensureInit() {
  if (app) return;
  if (!firebaseConfig.apiKey) {
    console.warn(
      "[Firebase] No API key configured — auth features disabled. Set VITE_FIREBASE_API_KEY in .env.local."
    );
    return;
  }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

// ── Auth helpers ──────────────────────────────────────────

export async function register(email, password, displayName) {
  ensureInit();
  if (!auth) throw new Error("Firebase not configured");
  const creds = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(creds.user, { displayName });
  }
  // create user profile in Firestore
  await setDoc(doc(db, "users", creds.user.uid), {
    email,
    displayName: displayName || "",
    createdAt: serverTimestamp(),
  });
  return creds.user;
}

export async function login(email, password) {
  ensureInit();
  if (!auth) throw new Error("Firebase not configured");
  const creds = await signInWithEmailAndPassword(auth, email, password);
  return creds.user;
}

export async function logout() {
  ensureInit();
  if (!auth) throw new Error("Firebase not configured");
  await signOut(auth);
}

export function onAuthChange(callback) {
  ensureInit();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// ── Firestore profile helpers ─────────────────────────────

export async function getUserProfile(uid) {
  ensureInit();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
  ensureInit();
  if (!db) return null;
  await setDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ── Status check ──────────────────────────────────────────

export function isFirebaseConfigured() {
  ensureInit();
  return !!auth;
}
