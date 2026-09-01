import "@testing-library/jest-dom";

// jsdom in this Vitest config exposes a non-functional `localStorage`.
// Provide a minimal in-memory Storage shim so i18n + auth can persist.
const store = new Map();

globalThis.localStorage = {
  get length() {
    return store.size;
  },
  clear() {
    store.clear();
  },
  getItem(key) {
    return store.has(String(key)) ? store.get(String(key)) : null;
  },
  key(index) {
    return [...store.keys()][index] ?? null;
  },
  removeItem(key) {
    store.delete(String(key));
  },
  setItem(key, value) {
    store.set(String(key), String(value));
  },
};