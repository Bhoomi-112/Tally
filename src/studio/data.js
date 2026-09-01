// ────────────────────────────────────────────────────────────
// ORBIS STUDIO — Mock project-management dashboard data
// ────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  "Dashboard",
  "Projects",
  "Time Sheets",
  "Growth Stats",
  "Automation",
  "Integration",
  "Team Members",
  "Financial",
];

export const BOOKMARKS = [
  { label: "#General", color: "#3F3F46" },
  { label: "UI Design Projects", color: "#F97316" },
  { label: "Recently done", color: "#8B5CF6" },
  { label: "Call booked on port...", color: "#EC4899" },
  { label: "Design Phase", color: "#F97316" },
];

export const SUMMARY_CARDS = [
  {
    id: "completed",
    title: "Total Completed Task",
    value: "43",
    delta: "+22.8%",
    trend: "up",
    color: "#22C55E",
    icon: "check",
  },
  {
    id: "avgTime",
    title: "Average Time Per Task",
    value: "73",
    delta: "-12.8%",
    trend: "down",
    color: "#EF4444",
    icon: "stopwatch",
  },
  {
    id: "byClient",
    title: "Total Tasks by Client",
    value: "83",
    delta: "-22.8%",
    trend: "down",
    color: "#EF4444",
    icon: "user",
  },
  {
    id: "active",
    title: "Total Active Projects",
    value: "53",
    delta: "+12.8%",
    trend: "up",
    color: "#22C55E",
    icon: "rotate",
  },
];

// Ongoing Tasks — weekday stacked bars (two series: pastel top + bold bottom)
export const ONGOING_TASKS = [
  { day: "Mon", active: 8, total: 6 },
  { day: "Tue", active: 12, total: 9 },
  { day: "Wed", active: 6, total: 12 },
  { day: "Thu", active: 15, total: 8 },
  { day: "Fri", active: 10, total: 7 },
  { day: "Sat", active: 7, total: 5 },
  { day: "Sun", active: 5, total: 4 },
];

export const ONGOING_BOOTSTRAP_COLORS = [
  "#FB7185",
  "#FB923C",
  "#4ADE80",
  "#A78BFA",
  "#22D3EE",
  "#60A5FA",
  "#FB7185",
];

// Sales & Revenue — smooth line
export const SALES = [
  { day: "Mon", revenue: 120 },
  { day: "Tue", revenue: 90 },
  { day: "Wed", revenue: 155 },
  { day: "Thu", revenue: 130 },
  { day: "Fri", revenue: 180 },
  { day: "Sat", revenue: 145 },
  { day: "Sun", revenue: 165 },
];

// Productivity KPIs — donut
export const PRODUCTIVITY = [
  { key: "Stuck", value: 2, color: "#EF4444" },
  { key: "In Progress", value: 11, color: "#F97316" },
  { key: "In Review", value: 3, color: "#3B82F6" },
  { key: "Done", value: 13, color: "#4ADE80" },
];

export const PRODUCTIVITY_TOTAL = 250;

// Task table
export const TASKS = [
  {
    id: 1,
    task: "Populate the table",
    description: "We should create a journal page to keep track...",
    assignee: "Bernadette",
    avatar: "B",
    avatarColor: "#22C55E",
    dueDate: "5 May, 2024",
    status: "Completed",
    statusColor: "#22C55E",
  },
  {
    id: 2,
    task: "Improve registration flow",
    description: "Refactor the signup wizard to reduce drop-off...",
    assignee: "Rahul",
    avatar: "R",
    avatarColor: "#8B5CF6",
    dueDate: "12 May, 2024",
    status: "In Progress",
    statusColor: "#F97316",
  },
  {
    id: 3,
    task: "Design pricing page",
    description: "Explore tiered plans and include a comparison table...",
    assignee: "Ayesha",
    avatar: "A",
    avatarColor: "#EC4899",
    dueDate: "18 May, 2024",
    status: "In Review",
    statusColor: "#3B82F6",
  },
  {
    id: 4,
    task: "Fix notification bug",
    description: "Email digests not firing for weekly summaries...",
    assignee: "Kiran",
    avatar: "K",
    avatarColor: "#22D3EE",
    dueDate: "21 May, 2024",
    status: "Completed",
    statusColor: "#22C55E",
  },
  {
    id: 5,
    task: "Export analytics report",
    description: "Add CSV/PDF export for the revenue dashboard...",
    assignee: "Meera",
    avatar: "M",
    avatarColor: "#F97316",
    dueDate: "25 May, 2024",
    status: "Completed",
    statusColor: "#22C55E",
  },
];

// Main rail icons (thin, circular)
export const MAIN_RAIL = [
  { id: "dashboard", icon: "layout", active: false },
  { id: "projects", icon: "folder", active: true },
  { id: "timesheets", icon: "clock", active: false },
  { id: "growth", icon: "trend", active: false },
  { id: "automation", icon: "zap", active: false },
  { id: "integration", icon: "plug", active: false },
  { id: "team", icon: "users", active: false },
  { id: "financial", icon: "wallet", active: false },
];
