import { Search, Bell, Star, Clock, Zap } from "lucide-react";

// ────────────────────────────────────────────────────────────
// StudioHeader — top-right header: Project label, search,
// clock, notifications, star, premium button.
// ────────────────────────────────────────────────────────────
export default function StudioHeader() {
  return (
    <header className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
      {/* Left: Project label */}
      <div className="shrink-0">
        <div className="text-[11px] text-gray-400 font-medium mb-0.5">Workspace</div>
        <div className="text-[15px] font-semibold text-gray-800">Project</div>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-gray-100 border border-transparent focus-within:border-emerald-500/40 focus-within:bg-white transition-colors">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            placeholder="Search AI..."
            className="flex-1 bg-transparent text-[13px] text-gray-700 placeholder:text-gray-400 outline-none"
            aria-label="Search"
          />
          <kbd className="font-mono text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
            CMD + K
          </kbd>
        </div>
      </div>

      {/* Right: clock, notification, star, premium */}
      <div className="flex items-center gap-1.5 ml-auto shrink-0">
        <IconBtn icon={<Clock className="w-4 h-4" />} label="Clock" />
        <IconBtn icon={<Bell className="w-4 h-4" />} label="Notifications" badge />
        <IconBtn icon={<Star className="w-4 h-4" />} label="Star" />
        <button className="ml-1 flex items-center gap-1.5 h-8 px-3 rounded-lg bg-violet-600 text-white text-[12px] font-semibold hover:bg-violet-700 transition-colors">
          <Zap className="w-3.5 h-3.5" />
          Premium
        </button>
      </div>
    </header>
  );
}

function IconBtn({ icon, label, badge }) {
  return (
    <button
      aria-label={label}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {icon}
      {badge && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </button>
  );
}
