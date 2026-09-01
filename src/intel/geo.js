// ────────────────────────────────────────────────────────────
// TALLY — Geospatial projection & state geometry
// Projects (lon, lat) into an SVG viewBox and provides
// simplified-but-consistent state polygon shapes centred on
// their real coordinates.
// ────────────────────────────────────────────────────────────

export const VIEW_W = 560;
export const VIEW_H = 580;

// Projection constants (linear scale to fit India's extent)
const LON_MIN = 68,
  LON_MAX = 97;
const LAT_MAX = 36;

const SCALE = (VIEW_W - 90) / (LON_MAX - LON_MIN);

export function project(lon, lat) {
  const x = 45 + (lon - LON_MIN) * SCALE;
  const y = 26 + (LAT_MAX - lat) * SCALE * (VIEW_H / (VIEW_W - 90)) * 0.78;
  return [x, y];
}

// Simplified India outline (lon, lat pairs, closed)
const OUTLINE = [
  [68.5, 24.0],
  [70.5, 22.5],
  [68.9, 21.0],
  [70.1, 18.9],
  [72.8, 21.1],
  [73.7, 19.2],
  [73.2, 17.0],
  [72.6, 15.4],
  [74.4, 14.6],
  [76.2, 12.9],
  [76.3, 10.0],
  [77.6, 8.2],
  [79.2, 10.6],
  [80.3, 12.8],
  [81.8, 13.2],
  [83.3, 15.7],
  [85.8, 14.5],
  [87.5, 16.6],
  [89.2, 18.2],
  [87.5, 20.8],
  [88.2, 22.9],
  [89.2, 24.7],
  [90.8, 25.3],
  [92.1, 24.6],
  [92.5, 22.7],
  [94.4, 25.4],
  [95.5, 26.9],
  [96.3, 28.1],
  [94.8, 29.2],
  [93.7, 28.6],
  [92.1, 29.5],
  [91.8, 27.9],
  [90.2, 27.8],
  [88.8, 26.8],
  [87.1, 27.6],
  [85.7, 29.2],
  [85.0, 30.2],
  [86.1, 32.2],
  [84.5, 33.2],
  [82.9, 33.7],
  [81.0, 33.1],
  [80.0, 31.2],
  [79.0, 31.5],
  [78.7, 30.1],
  [77.4, 29.8],
  [76.5, 28.7],
  [76.8, 27.2],
  [75.3, 27.2],
  [74.3, 26.1],
  [73.6, 24.8],
  [73.6, 24.0],
  [71.4, 24.0],
  [70.6, 23.2],
  [68.8, 23.9],
  [68.5, 24.0],
];

export function outlinePath() {
  return (
    OUTLINE.map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + " Z"
  );
}

// Simplified polygon per region id (state centroid + radius preset)
const STATE_POLY = {
  MH: { base: [19.5, 76.3], r: 2.6, w: 2.1 },
  KA: { base: [14.5, 76.3], r: 2.1, w: 1.6 },
  UP: { base: [26.8, 81.0], r: 2.4, w: 2.6 },
  TN: { base: [10.8, 78.2], r: 2.0, w: 1.6 },
  GJ: { base: [22.5, 71.8], r: 2.0, w: 1.8 },
  KL: { base: [10.5, 76.5], r: 1.3, w: 1.0 },
  WB: { base: [23.0, 88.3], r: 1.7, w: 1.6 },
  RJ: { base: [26.8, 74.0], r: 2.6, w: 2.4 },
};

export function stateShape(id, layer) {
  const cfg = STATE_POLY[id];
  if (!cfg) return "";
  const [cx, cy] = project(cfg.base[0], cfg.base[1]);
  const A = (a) => (a * Math.PI) / 180;
  const pts = [];
  // layer drives the polygon's vertex count: hexbin=hexagonal,
  // choropleth=smoother, migration=finely tessellated
  const steps = layer === "hexbin" ? 6 : layer === "migration" ? 9 : 8;
  const seed = 0.7 + (layer === "hexbin" ? 0.05 : 0.15);
  for (let i = 0; i < steps; i++) {
    const a = A((360 / steps) * i - 90);
    // irregular radius modulated by layer seed for visual variance
    const rr = cfg.r * (1 + seed * Math.sin(3 * a));
    const wr = cfg.w * (1 + seed * Math.cos(2 * a));
    pts.push(
      `L${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * wr).toFixed(1)}`.slice(1)
    );
  }
  return `M${cx.toFixed(1)},${cy.toFixed(1)} ${pts.join(" ")} Z`;
}

// Migration vector lines between urban hubs
export const MIGRATION_LINES = [
  { from: "MH", to: "KA" },
  { from: "UP", to: "MH" },
  { from: "UP", to: "GJ" },
  { from: "WB", to: "MH" },
  { from: "GJ", to: "KA" },
  { from: "RJ", to: "GJ" },
];

export function centroid(id) {
  const cfg = STATE_POLY[id];
  if (!cfg) return project(20, 78);
  return project(cfg.base[0], cfg.base[1]);
}
