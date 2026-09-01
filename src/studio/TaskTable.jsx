import { Pencil, Eye } from "lucide-react";
import { TASKS } from "./data.js";

// ────────────────────────────────────────────────────────────
// TaskTable — clean table with gray header, rounded container,
// status pills and edit/view actions.
// ────────────────────────────────────────────────────────────
export default function TaskTable() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-[14px] font-semibold text-gray-800">Successful Tasks</h3>
        <button className="text-[12px] font-medium text-gray-400 hover:text-gray-600">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[11px] font-semibold uppercase tracking-wide">
              <th className="px-4 py-2.5 font-semibold">Successful Tasks</th>
              <th className="px-4 py-2.5 font-semibold">Description</th>
              <th className="px-4 py-2.5 font-semibold">Assignee</th>
              <th className="px-4 py-2.5 font-semibold">Due Date</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold text-right">Active</th>
            </tr>
          </thead>
          <tbody>
            {TASKS.map((t) => (
              <tr
                key={t.id}
                className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3 text-[13px] font-medium text-gray-700">{t.task}</td>
                <td className="px-4 py-3 text-[12.5px] text-gray-400 max-w-[260px] truncate">
                  {t.description}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-semibold"
                      style={{ background: t.avatarColor }}
                    >
                      {t.avatar}
                    </span>
                    <span className="text-[12.5px] text-gray-600">{t.assignee}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12.5px] text-gray-500">{t.dueDate}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-medium"
                    style={{ color: t.statusColor, background: `${t.statusColor}18` }}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      aria-label={`Edit ${t.task}`}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
                    </button>
                    <button
                      aria-label={`View ${t.task}`}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
