import { ChevronDown } from "lucide-react";

// ────────────────────────────────────────────────────────────
// StudioCard — white card with soft rounded corners, subtle
// shadow, title, and an optional "Weekly" dropdown.
// ────────────────────────────────────────────────────────────
export default function StudioCard({ title, dropdown = true, children, className = "" }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-gray-800">{title}</h3>
        {dropdown && (
          <button className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-600 font-medium">
            Weekly
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
