import { CheckCircle2, Timer, Users, RefreshCw, Info, Star } from "lucide-react";
import { SUMMARY_CARDS } from "./data.js";

// ────────────────────────────────────────────────────────────
// ProjectOverview — title + description + four summary cards.
// ────────────────────────────────────────────────────────────
export default function ProjectOverview() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-[18px] font-bold text-gray-800">Projects</h2>
        <button
          aria-label="Info"
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
        >
          <Info className="w-4 h-4" />
        </button>
        <button
          aria-label="Star"
          className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-amber-400"
        >
          <Star className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[12.5px] text-gray-400 mb-4">
        Manage projects by assigning owners, setting timelines, and tracking progress.
      </p>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map((c) => (
          <SummaryCard key={c.id} card={c} />
        ))}
      </div>
    </section>
  );
}

function SummaryCard({ card }) {
  const Icon = ICON_MAP[card.icon] || RefreshCw;
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${card.color}18`, color: card.color }}
          >
            <Icon className="w-4 h-4" strokeWidth={1.9} />
          </span>
        </div>
        <span
          className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
            card.trend === "up" ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
          }`}
        >
          {card.delta[0] === "+" ? "▲" : "▼"} {card.delta.slice(1)}
        </span>
      </div>

      <div className="mt-3 text-[24px] font-bold text-gray-800 leading-none">{card.value}</div>
      <div className="mt-1.5 text-[12px] text-gray-400">{card.title}</div>
    </article>
  );
}

const ICON_MAP = {
  check: CheckCircle2,
  stopwatch: Timer,
  user: Users,
  rotate: RefreshCw,
};
