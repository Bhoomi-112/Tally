import { useState } from "react";
import SystemHeader from "./SystemHeader.jsx";
import MetricGrid from "./MetricGrid.jsx";
import GeospatialCanvas from "./GeospatialCanvas.jsx";
import Inspector from "./Inspector.jsx";

// ────────────────────────────────────────────────────────────
// TALLY — Census Intelligence Platform (main workspace)
// ────────────────────────────────────────────────────────────
export default function IntelPage() {
  const [viewMode, setViewMode] = useState("macro");
  const [layer, setLayer] = useState("choropleth");
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoverRegion, setHoverRegion] = useState(null);

  const selection = activeRegion || hoverRegion;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-200 font-sans antialiased selection:bg-slate-700">
      <SystemHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSelectRegion={setActiveRegion}
      />

      <main className="px-4 py-4 max-w-[1600px] mx-auto space-y-px">
        {/* Precision Metric Grid */}
        <MetricGrid />

        {/* Split viewport: 65% geospatial / 35% inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-px bg-slate-800/70 mt-px rounded-md border border-slate-800/80 overflow-hidden">
          <div className="min-w-0">
            <GeospatialCanvas
              viewMode={viewMode}
              layer={layer}
              onLayerChange={setLayer}
              activeRegion={activeRegion}
              onSelectRegion={setActiveRegion}
              onHoverRegion={setHoverRegion}
            />
          </div>
          <div className="min-w-0">
            <Inspector activeRegion={selection} viewMode={viewMode} />
          </div>
        </div>

        {/* Footer provenance strip */}
        <footer className="flex items-center justify-between px-1 pt-3 pb-6 font-mono text-[9.5px] text-slate-600">
          <span>TALLy · CENSUS INTELLIGENCE PLATFORM · V4.2</span>
          <span>GOV-IN // REGISTRY AUTHORITY · ERGC-CENSUS.GOV.IN · 2026-09-01</span>
        </footer>
      </main>
    </div>
  );
}
