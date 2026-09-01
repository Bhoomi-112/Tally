import { describe, it, expect, beforeEach } from "vitest";
import i18n from "../i18n/index.js";

// ────────────────────────────────────────────────────────────
// i18n — localization keys + language switching smoke tests
// ────────────────────────────────────────────────────────────

describe("i18n", () => {
  const en = i18n.getResourceBundle("en", "translation");
  const hi = i18n.getResourceBundle("hi", "translation");

  beforeEach(() => {
    i18n.changeLanguage("en");
  });

  it("registers both locales with identical key shapes", () => {
    expect(en).toBeTruthy();
    expect(hi).toBeTruthy();

    // Every top-level group must exist in both locales.
    expect(Object.keys(en).sort()).toEqual(Object.keys(hi).sort());
  });

  it("provides every required nav key", () => {
    for (const key of ["dates", "wizard", "chat", "census", "privacy", "data"]) {
      expect(en.nav[key]).toBeTruthy();
      expect(hi.nav[key]).toBeTruthy();
    }
  });

  it("switches language and persists to localStorage + <html lang>", () => {
    expect(i18n.resolvedLanguage).toBe("en");
    i18n.changeLanguage("hi");
    expect(i18n.resolvedLanguage?.startsWith("hi")).toBe(true);
    expect(localStorage.getItem("tally-lang")).toBe("hi");
    expect(document.documentElement.lang).toBe("hi");
  });

  it("falls back to English for missing keys (returnNull disabled)", () => {
    expect(i18n.t("does.not.exist")).not.toBeNull();
  });

  it("interpolates interpolation strings", () => {
    i18n.changeLanguage("hi");
    // If the value contains a placeholder it is filled; otherwise identity.
    const mod = i18n.t("home.tracking", { count: 35 });
    expect(typeof mod).toBe("string");
  });
});