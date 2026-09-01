// ────────────────────────────────────────────────────────────
// CursorHUD — floating, lag-free micro-tooltip that tracks the
// mouse over the geospatial canvas. Rendered only when hover
// data is present.
// ────────────────────────────────────────────────────────────
export default function CursorHUD({ data, mouse }) {
  if (!data || !mouse) return null;

  const { region, density, margin } = data;

  return (
    <div
      className="pointer-events-none absolute z-30 hidden md:block"
      style={{
        left: Math.min(mouse.x + 14, mouse.parentW - 190),
        top: Math.min(mouse.y + 14, mouse.parentH - 92),
      }}
    >
      <div className="w-max max-w-[190px] rounded-md border border-slate-700 bg-[#0A0D14]/95 shadow-2xl px-2.5 py-2 font-mono text-[10px]">
        <div className="text-slate-200 truncate mb-1">Region: {region}</div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Density</span>
          <span className="text-[#E5A95D]">{density.toLocaleString("en-IN")}/km²</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Sample Margin</span>
          <span className="text-[#7D9D8B]">±{margin}%</span>
        </div>
      </div>
    </div>
  );
}
