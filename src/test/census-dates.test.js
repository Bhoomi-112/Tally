/**
 * Tests for the census-dates.json dataset schema.
 * These are deterministic — no AI, no network.
 * Write these first (spec requirement).
 */
import { describe, it, expect } from "vitest";
import censusData from "../modules/dates/data/census-dates.json";

const REQUIRED_STATE_FIELDS = ["id", "name", "region", "phaseI", "phaseII"];
const REQUIRED_PHASE_FIELDS = ["label", "start", "end", "source", "lastVerified", "provisional"];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

describe("census-dates.json schema", () => {
  it("has _meta with required fields", () => {
    expect(censusData._meta).toBeDefined();
    expect(censusData._meta.description).toBeTruthy();
    expect(censusData._meta.lastUpdated).toMatch(DATE_REGEX);
    expect(censusData._meta.disclaimer).toBeTruthy();
  });

  it("contains exactly 36 states/UTs", () => {
    expect(censusData.states).toHaveLength(36);
  });

  it("all state IDs are unique", () => {
    const ids = censusData.states.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it.each(censusData.states)(
    "state '$name' ($id) has all required top-level fields",
    (state) => {
      for (const field of REQUIRED_STATE_FIELDS) {
        expect(state, `Missing field: ${field} in ${state.id}`).toHaveProperty(field);
      }
    }
  );

  it.each(censusData.states)(
    "state '$name' ($id) Phase I has all required phase fields and valid dates",
    (state) => {
      for (const field of REQUIRED_PHASE_FIELDS) {
        expect(state.phaseI, `Missing phaseI.${field} in ${state.id}`).toHaveProperty(field);
      }
      expect(state.phaseI.start).toMatch(DATE_REGEX);
      expect(state.phaseI.end).toMatch(DATE_REGEX);
      expect(new Date(state.phaseI.start) < new Date(state.phaseI.end)).toBe(true);
      expect(state.phaseI.source).toContain("http");
    }
  );

  it.each(censusData.states)(
    "state '$name' ($id) Phase II has all required phase fields and valid dates",
    (state) => {
      for (const field of REQUIRED_PHASE_FIELDS) {
        expect(state.phaseII, `Missing phaseII.${field} in ${state.id}`).toHaveProperty(field);
      }
      expect(state.phaseII.start).toMatch(DATE_REGEX);
      expect(state.phaseII.end).toMatch(DATE_REGEX);
      expect(new Date(state.phaseII.start) < new Date(state.phaseII.end)).toBe(true);
    }
  );

  it("Phase I ends before Phase II starts for all states", () => {
    for (const state of censusData.states) {
      const phaseIEnd = new Date(state.phaseI.end);
      const phaseIIStart = new Date(state.phaseII.start);
      expect(phaseIEnd < phaseIIStart, `Phase I/II overlap in ${state.id}`).toBe(true);
    }
  });

  it("all provisional flags are boolean", () => {
    for (const state of censusData.states) {
      expect(typeof state.phaseI.provisional).toBe("boolean");
      expect(typeof state.phaseII.provisional).toBe("boolean");
    }
  });
});
