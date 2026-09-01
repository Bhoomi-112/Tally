import {
  LayoutGrid,
  FolderKanban,
  Clock3,
  TrendingUp,
  Zap,
  Plug,
  Users,
  Wallet,
  Orbit,
} from "lucide-react";
import { NAV_ITEMS, BOOKMARKS, MAIN_RAIL } from "./data.js";

// ────────────────────────────────────────────────────────────
// StudioSidebar — narrow main rail + sub-menu navigation +
// bookmarks section.
// ────────────────────────────────────────────────────────────
export default function StudioSidebar() {
  return (
    <aside className="flex shrink-0 h-full bg-white">
      {/* Main navigation rail */}
      <div className="w-[60px] flex flex-col items-center gap-2 py-4 border-r border-gray-100 bg-white">
        <div className="w-9 h-9 mb-2 rounded-xl bg-orange-500 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-sm">
          <Orbit className="w-5 h-5" />
        </div>
        {MAIN_RAIL.map((item) => {
          const Icon = RAIL_ICONS[item.icon] || Wallet;
          return (
            <button
              key={item.id}
              aria-label={item.id}
              aria-current={item.active ? "page" : undefined}
              className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                item.active
                  ? "bg-emerald-500/15 text-emerald-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
              {item.active && <span className="absolute left-0 w-1 h-6 rounded-r bg-emerald-500" />}
            </button>
          );
        })}
      </div>

      {/* Sub-menu navigation */}
      <div className="w-[220px] flex-1 py-5 px-3 bg-gray-50/60 border-r border-gray-100">
        {/* Logo label */}
        <div className="flex items-center gap-2 px-2 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-[13px] font-bold text-gray-800">Orbis Studio</span>
        </div>

        {/* Vertical links */}
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((label, i) => {
            const active = i === 1; // Projects active
            const growth = i === 3; // Growth Stats highlight
            if (growth) {
              return (
                <button
                  key={label}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12.5px] font-medium transition-colors ${
                    active
                      ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                      : "bg-[#EAF7EF] text-emerald-700 border border-emerald-100"
                  }`}
                >
                  {label}
                </button>
              );
            }
            return (
              <button
                key={label}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12.5px] font-medium transition-colors ${
                  active
                    ? "bg-white text-gray-900 shadow-sm border border-gray-100 font-semibold"
                    : "text-gray-500 hover:text-gray-800 hover:bg-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bookmarks */}
        <div className="mt-6">
          <div className="px-2.5 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Bookmarks
          </div>
          <div className="space-y-1">
            {BOOKMARKS.map((b) => (
              <button
                key={b.label}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-[12px] text-gray-500 hover:text-gray-800 hover:bg-white transition-colors"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} />
                <span className="truncate">{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

const RAIL_ICONS = {
  layout: LayoutGrid,
  folder: FolderKanban,
  clock: Clock3,
  trend: TrendingUp,
  zap: Zap,
  plug: Plug,
  users: Users,
  wallet: Wallet,
};
