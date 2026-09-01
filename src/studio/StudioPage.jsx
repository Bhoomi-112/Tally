import StudioSidebar from "./StudioSidebar.jsx";
import StudioHeader from "./StudioHeader.jsx";
import ProjectOverview from "./ProjectOverview.jsx";
import OngoingTasksChart from "./OngoingTasksChart.jsx";
import SalesRevenueChart from "./SalesRevenueChart.jsx";
import ProductivityKPIs from "./ProductivityKPIs.jsx";
import TaskTable from "./TaskTable.jsx";

// ────────────────────────────────────────────────────────────
// StudioPage — light-themed Orbis Studio project-management
// dashboard inside a white card on a light gray background.
// ────────────────────────────────────────────────────────────
export default function StudioPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 sm:p-6 font-sans antialiased">
      <div className="w-full max-w-[1280px] bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 flex">
        {/* Left: sidebar */}
        <StudioSidebar />

        {/* Right: content */}
        <div className="flex-1 min-w-0 bg-gray-50">
          <StudioHeader />

          <main className="p-5 space-y-5">
            {/* Project Overview */}
            <ProjectOverview />

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <OngoingTasksChart />
              <SalesRevenueChart />
            </div>

            {/* Productivity KPIs */}
            <ProductivityKPIs />

            {/* Task table */}
            <TaskTable />
          </main>
        </div>
      </div>
    </div>
  );
}
