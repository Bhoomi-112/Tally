/**
 * Tests for dates utility functions.
 * All deterministic — no AI, no network.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDate,
  getPhaseStatus,
  filterStates,
  groupByRegion,
  getStatusMeta,
} from "../modules/dates/dates.utils.js";

// ── formatDate ───────────────────────────────────────────────────
describe("formatDate", () => {
  it("formats a valid date string", () => {
    const result = formatDate("2027-02-09");
    expect(result).toContain("2027");
    expect(result).toMatch(/Feb/i);
  });

  it('returns "TBD" for falsy input', () => {
    expect(formatDate(null)).toBe("TBD");
    expect(formatDate("")).toBe("TBD");
    expect(formatDate(undefined)).toBe("TBD");
  });
});

// ── getPhaseStatus ───────────────────────────────────────────────
describe("getPhaseStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "upcoming" when today is before start', () => {
    vi.setSystemTime(new Date("2026-01-01"));
    expect(getPhaseStatus("2026-04-01", "2026-09-30")).toBe("upcoming");
  });

  it('returns "active" when today is within the range', () => {
    vi.setSystemTime(new Date("2026-06-15"));
    expect(getPhaseStatus("2026-04-01", "2026-09-30")).toBe("active");
  });

  it('returns "completed" when today is after end', () => {
    vi.setSystemTime(new Date("2026-12-01"));
    expect(getPhaseStatus("2026-04-01", "2026-09-30")).toBe("completed");
  });
});

// ── getStatusMeta ────────────────────────────────────────────────
describe("getStatusMeta", () => {
  it("returns label and className for active", () => {
    const meta = getStatusMeta("active");
    expect(meta.label).toBe("Active Now");
    expect(meta.className).toBeTruthy();
  });

  it("returns label and className for upcoming", () => {
    const meta = getStatusMeta("upcoming");
    expect(meta.label).toBe("Upcoming");
  });

  it("returns label and className for completed", () => {
    const meta = getStatusMeta("completed");
    expect(meta.label).toBe("Completed");
  });
});

// ── filterStates ─────────────────────────────────────────────────
const MOCK_STATES = [
  { id: "DL", name: "Delhi", region: "North" },
  { id: "MH", name: "Maharashtra", region: "West" },
  { id: "TN", name: "Tamil Nadu", region: "South" },
  { id: "AS", name: "Assam", region: "Northeast" },
];

describe("filterStates", () => {
  it("returns all states when query is empty", () => {
    expect(filterStates(MOCK_STATES, "")).toHaveLength(4);
    expect(filterStates(MOCK_STATES, "   ")).toHaveLength(4);
  });

  it("filters by state name (case-insensitive)", () => {
    const result = filterStates(MOCK_STATES, "delhi");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("DL");
  });

  it("filters by region", () => {
    const result = filterStates(MOCK_STATES, "south");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("TN");
  });

  it("filters by state ID", () => {
    const result = filterStates(MOCK_STATES, "MH");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Maharashtra");
  });

  it("returns empty array for no match", () => {
    expect(filterStates(MOCK_STATES, "zzz")).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    expect(filterStates(MOCK_STATES, "TAMIL")).toHaveLength(1);
    expect(filterStates(MOCK_STATES, "tamil")).toHaveLength(1);
  });
});

// ── groupByRegion ────────────────────────────────────────────────
describe("groupByRegion", () => {
  it("groups states by region correctly", () => {
    const result = groupByRegion(MOCK_STATES);
    expect(result["North"]).toHaveLength(1);
    expect(result["West"]).toHaveLength(1);
    expect(result["South"]).toHaveLength(1);
    expect(result["Northeast"]).toHaveLength(1);
  });

  it("returns an empty object for empty input", () => {
    expect(groupByRegion([])).toEqual({});
  });

  it("groups multiple states in same region", () => {
    const states = [
      { id: "DL", name: "Delhi", region: "North" },
      { id: "UP", name: "Uttar Pradesh", region: "North" },
    ];
    const result = groupByRegion(states);
    expect(result["North"]).toHaveLength(2);
  });
});
