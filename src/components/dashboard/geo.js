// Simplified geographic data for the India census map.
// All coordinates are real (lon, lat) and projected through the same
// projection used for state dots so shapes align correctly on the canvas.

export const VIEW_BOX = { width: 560, height: 580 };

// Geographic bounds used for projection (lon/lat)
export const LON_RANGE = { min: 68, max: 97 };
export const LAT_RANGE = { min: 8, max: 35 };

// Map a (lon, lat) coordinate to SVG pixel space within VIEW_BOX
export function project(lon, lat) {
  const x = ((lon - LON_RANGE.min) / (LON_RANGE.max - LON_RANGE.min)) * (VIEW_BOX.width - 80) + 40;
  const y = ((LAT_RANGE.max - lat) / (LAT_RANGE.max - LAT_RANGE.min)) * (VIEW_BOX.height - 40) + 20;
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
  };
}

// Simplified outline of India as [lon, lat] vertices (clockwise around the
// boundary). This is a recognizable but heavily simplified silhouette.
const INDIA_BOUNDARY = [
  [68.2, 23.8], // Kutch, Gujarat west
  [69.3, 22.3], // Arabian Sea coast (Gujarat)
  [72.6, 21.2], // Surat coast
  [73.0, 18.9], // Konkan
  [73.9, 17.0], // Mumbai region
  [74.0, 14.9], // Karnataka coast
  [74.9, 13.0], // Malabar
  [77.0, 8.1], // Kerala tip
  [78.2, 8.1], // Kanyakumari
  [79.9, 10.2], // Tamil Nadu
  [80.3, 13.2], // Coromandel coast
  [79.8, 15.8], // Andhra coast
  [80.3, 17.0],
  [82.3, 17.3], // Andhra/Odisha
  [83.4, 18.9], // Odisha coast
  [86.0, 20.5], // Odisha
  [87.5, 21.5], // West Bengal coast
  [88.1, 21.7],
  [89.2, 22.4], // Sundarbans
  [89.0, 23.5], // Bangladesh border
  [88.6, 24.0],
  [89.0, 25.6],
  [89.1, 26.5], // Assam foothills
  [92.7, 26.2], // NE — Brahmaputra
  [93.5, 27.0], // Arunachal
  [97.0, 27.5], // Northeast tip (Arunachal)
  [97.0, 28.3],
  [94.3, 29.4], // Arunachal top
  [92.5, 28.0],
  [90.0, 27.2], // Sikkim/NB
  [88.6, 27.8], // Sikkim
  [87.8, 27.2], // Nepal border
  [85.5, 27.9],
  [84.0, 28.3], // Nepal border west
  [82.8, 28.7],
  [81.0, 28.4], // UP top
  [79.5, 28.0], // Nepal west
  [78.6, 28.4], // Uttarakhand
  [78.9, 29.4],
  [80.0, 29.9],
  [80.0, 30.8], // Himalaya
  [79.0, 31.2], // Uttarakhand top
  [77.9, 31.3],
  [76.8, 32.7], // Himachal
  [76.2, 34.0], // HP north
  [75.6, 34.2], // Kashmir
  [74.9, 35.0], // Kashmir north
  [74.3, 34.8],
  [73.5, 34.6], // Kashmir west
  [74.3, 33.2],
  [74.0, 32.0], // J&K south
  [74.9, 31.6], // Punjab
  [74.5, 30.6],
  [73.5, 30.4], // Rajasthan
  [72.1, 30.0],
  [70.0, 29.0], // Rajasthan/Pakistan border
  [68.7, 28.5],
  [68.5, 27.0],
  [68.2, 25.0], // Thar
  [70.0, 24.6],
  [69.4, 23.8], // Kutch close
];

export function buildOutlinePath() {
  const pts = INDIA_BOUNDARY.map(([lon, lat]) => project(lon, lat));
  return "M" + pts.map((p, i) => (i === 0 ? `${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ") + " Z";
}

// Real (lon, lat) centers for each state id (approximate capital/centroid)
const STATE_CENTERS = {
  AN: [93.0, 11.7],
  AP: [80.0, 16.5],
  AR: [94.7, 28.2],
  AS: [92.9, 26.3],
  BR: [85.3, 25.2],
  CH: [76.8, 30.7],
  CG: [81.6, 21.7],
  DNH: [73.0, 20.3],
  DL: [77.2, 28.6],
  GA: [74.0, 15.4],
  GJ: [71.8, 22.5],
  HR: [76.6, 29.4],
  HP: [77.2, 31.8],
  JK: [75.3, 33.4],
  JH: [85.4, 23.6],
  KA: [76.3, 14.5],
  KL: [76.5, 10.5],
  LA: [78.0, 34.0],
  LD: [73.3, 10.5],
  MP: [79.0, 23.5],
  MH: [76.3, 19.5],
  MN: [94.0, 24.8],
  ML: [91.2, 25.5],
  MZ: [92.8, 23.3],
  NL: [94.3, 26.3],
  OD: [84.8, 20.5],
  PY: [79.8, 11.9],
  PB: [75.6, 30.9],
  RJ: [74.0, 26.8],
  SK: [88.6, 27.5],
  TN: [78.2, 10.8],
  TG: [79.7, 17.9],
  TR: [91.5, 23.9],
  UP: [80.7, 26.5],
  UK: [79.0, 29.9],
  WB: [88.3, 23.0],
};

export function getStateCenter(id) {
  return STATE_CENTERS[id] || [78.5, 21.5];
}

// Convert a state-id map to projected {id, x, y} points
export function projectStates(stateObjects) {
  return stateObjects.map((s) => {
    const [lon, lat] = getStateCenter(s.id);
    return { ...s, pos: project(lon, lat) };
  });
}
