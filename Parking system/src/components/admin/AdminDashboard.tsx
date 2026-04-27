import { useState, useMemo } from "react";
import {
  Users,
  PlusCircle,
  Edit,
  Trash2,
  LogOut,
  BarChart3,
  MapPin,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  LayoutDashboard,
  Settings,
  DollarSign,
  Activity,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { Logo } from "../shared/Logo";
import { useI18n } from "../../lib/i18n";

const pieColors = ["#2E7D32", "#66bb6a", "#a5d6a7", "#c8e6c9", "#e8f5e9"];

type Tab = "overview" | "lots" | "agents" | "analytics";

type LotRow = {
  id: number;
  nameKey: string;
  zoneKey: string;
  capacity: number;
  available: number;
};

type AgentRow = {
  id: number;
  name: string;
  agentId: string;
  lotKey: string;
  active: boolean;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { t, dir } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);

  const parkingLots: LotRow[] = useMemo(
    () => [
      { id: 1, nameKey: "admin.lot.university", zoneKey: "admin.zone.center", capacity: 20, available: 15 },
      { id: 2, nameKey: "admin.lot.city", zoneKey: "admin.zone.north", capacity: 15, available: 0 },
      { id: 3, nameKey: "admin.lot.market", zoneKey: "admin.zone.south", capacity: 25, available: 8 },
      { id: 4, nameKey: "admin.lot.lion", zoneKey: "admin.zone.east", capacity: 12, available: 2 },
      { id: 5, nameKey: "admin.lot.park", zoneKey: "admin.zone.west", capacity: 30, available: 18 },
    ],
    []
  );

  const agents: AgentRow[] = useMemo(
    () => [
      { id: 1, name: "Ahmed El Mansouri", agentId: "AGT-001", lotKey: "admin.lot.university", active: true },
      { id: 2, name: "Fatima Zahraoui", agentId: "AGT-002", lotKey: "admin.lot.city", active: true },
      { id: 3, name: "Mohamed Saidi", agentId: "AGT-003", lotKey: "admin.lot.market", active: false },
      { id: 4, name: "Sara El Idrissi", agentId: "AGT-004", lotKey: "admin.lot.lion", active: true },
    ],
    []
  );

  const densityData = useMemo(
    () => [
      { name: t("admin.zone.center"), value: 75 },
      { name: t("admin.zone.north"), value: 100 },
      { name: t("admin.zone.south"), value: 68 },
      { name: t("admin.zone.east"), value: 83 },
      { name: t("admin.zone.west"), value: 40 },
    ],
    [t]
  );

  const peakHoursData = [
    { hour: "08:00", occupancy: 45 },
    { hour: "10:00", occupancy: 78 },
    { hour: "12:00", occupancy: 92 },
    { hour: "14:00", occupancy: 88 },
    { hour: "16:00", occupancy: 95 },
    { hour: "18:00", occupancy: 72 },
    { hour: "20:00", occupancy: 35 },
  ];

  const weekRevenueData = useMemo(
    () => [
      { day: t("admin.day.sat"), revenue: 1250 },
      { day: t("admin.day.sun"), revenue: 980 },
      { day: t("admin.day.mon"), revenue: 1420 },
      { day: t("admin.day.tue"), revenue: 1680 },
      { day: t("admin.day.wed"), revenue: 1510 },
      { day: t("admin.day.thu"), revenue: 2010 },
      { day: t("admin.day.fri"), revenue: 1820 },
    ],
    [t]
  );

  const zonePie = useMemo(
    () => [
      { name: t("admin.zone.center"), value: 20 },
      { name: t("admin.zone.north"), value: 15 },
      { name: t("admin.zone.south"), value: 25 },
      { name: t("admin.zone.east"), value: 12 },
      { name: t("admin.zone.west"), value: 30 },
    ],
    [t]
  );

  const totalCapacity = parkingLots.reduce((s, l) => s + l.capacity, 0);
  const totalAvailable = parkingLots.reduce((s, l) => s + l.available, 0);
  const occupancyRate = Math.round(
    ((totalCapacity - totalAvailable) / totalCapacity) * 100
  );
  const totalRevenue = weekRevenueData.reduce((s, d) => s + d.revenue, 0);

  const tabTitles: Record<Tab, string> = {
    overview: t("admin.title.overview"),
    lots: t("admin.title.lots"),
    agents: t("admin.title.agents"),
    analytics: t("admin.title.analytics"),
  };

  const tabSubs: Record<Tab, string> = {
    overview: t("admin.sub.overview"),
    lots: t("admin.sub.lots"),
    agents: t("admin.sub.agents"),
    analytics: t("admin.sub.analytics"),
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-e border-slate-200 flex-col shrink-0">
        <div className="p-5 border-b border-slate-100">
          <Logo size="md" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarItem
            icon={LayoutDashboard}
            label={t("admin.nav.overview")}
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarItem
            icon={MapPin}
            label={t("admin.nav.lots")}
            active={activeTab === "lots"}
            onClick={() => setActiveTab("lots")}
            badge={parkingLots.length}
          />
          <SidebarItem
            icon={Users}
            label={t("admin.nav.agents")}
            active={activeTab === "agents"}
            onClick={() => setActiveTab("agents")}
            badge={agents.length}
          />
          <SidebarItem
            icon={TrendingUp}
            label={t("admin.nav.analytics")}
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
          />
          <div className="my-3 h-px bg-slate-100" />
          <SidebarItem icon={Settings} label={t("admin.nav.settings")} />
        </nav>
        <div className="p-3 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full gap-2 border-slate-200 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            {t("common.logout")}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Logo size="sm" showText={false} />
            </div>
            <div className="flex-1 relative max-w-xl">
              <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={t("admin.search")}
                className="pe-10 h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-200 rounded-xl relative"
              aria-label={t("common.notifications")}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
            <LanguageSwitcher />
            <div className="hidden sm:flex items-center gap-2 pe-3 me-1 border-e border-slate-200">
              <div className="w-9 h-9 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center">
                {t("admin.role").charAt(0)}
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[#0f172a]">
                  {t("admin.role")}
                </div>
                <div className="text-[11px] text-slate-500">
                  admin@ifrane.ma
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile tabs */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto">
          <div className="flex gap-2">
            {(
              [
                ["overview", t("admin.tab.overview")],
                ["lots", t("admin.tab.lots")],
                ["agents", t("admin.tab.agents")],
                ["analytics", t("admin.tab.analytics")],
              ] as [Tab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 transition ${
                  activeTab === key
                    ? "gradient-primary text-white shadow-green"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {/* Page title */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a]">
                {tabTitles[activeTab]}
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                {tabSubs[activeTab]}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white ring-1 ring-slate-200 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t("common.live")}
            </div>
          </div>

          {/* Stats cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={MapPin}
              label={t("admin.stat.totalLots")}
              value={parkingLots.length.toString()}
              delta="+0"
              trend="up"
              color="#2E7D32"
              bg="#e8f5e9"
            />
            <StatCard
              icon={BarChart3}
              label={t("admin.stat.totalCapacity")}
              value={totalCapacity.toString()}
              delta="+5"
              trend="up"
              color="#0284c7"
              bg="#e0f2fe"
            />
            <StatCard
              icon={TrendingUp}
              label={t("admin.stat.occupancyRate")}
              value={`${occupancyRate}%`}
              delta="+12%"
              trend="up"
              color="#d97706"
              bg="#fef3c7"
            />
            <StatCard
              icon={DollarSign}
              label={t("admin.stat.weekRevenue")}
              value={`${totalRevenue.toLocaleString()}`}
              suffix={t("common.dirham")}
              delta="+8.2%"
              trend="up"
              color="#7c3aed"
              bg="#ede9fe"
            />
          </section>

          {/* ----- Overview ----- */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-slate-200 p-5 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-[#0f172a]">
                      {t("admin.weekRevenue.title")}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t("admin.weekRevenue.total")}{" "}
                      <span className="font-semibold text-[#0f172a]">
                        {totalRevenue.toLocaleString()} {t("common.dirham")}
                      </span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 rounded-full px-2.5 py-1">
                    <TrendingUp className="w-3 h-3" />
                    +8.2%
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={weekRevenueData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2ef" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        direction: dir,
                        fontSize: 12,
                      }}
                      formatter={(v) => [
                        `${v} ${t("common.dirham")}`,
                        t("admin.weekRevenue.label"),
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2E7D32"
                      strokeWidth={2.5}
                      fill="url(#g1)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 shadow-soft">
                <h2 className="font-bold text-[#0f172a] mb-4">
                  {t("admin.zoneCapacity.title")}
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={zonePie}
                      dataKey="value"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {zonePie.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        direction: dir,
                        fontSize: 12,
                      }}
                      formatter={(v, n) => [
                        `${v} ${t("admin.zoneCapacity.unit")}`,
                        n,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="mt-3 space-y-1.5">
                  {zonePie.map((z, i) => (
                    <li
                      key={z.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: pieColors[i] }}
                        />
                        {z.name}
                      </span>
                      <span className="font-semibold text-[#0f172a]">
                        {z.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-slate-200 shadow-soft overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-bold text-[#0f172a]">
                    {t("admin.recentLots")}
                  </h2>
                  <button
                    onClick={() => setActiveTab("lots")}
                    className="text-xs font-semibold text-[#2E7D32] hover:underline"
                  >
                    {t("common.viewAll")}
                  </button>
                </div>
                <LotsTable lots={parkingLots.slice(0, 5)} compact />
              </div>

              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <h2 className="font-bold text-[#0f172a]">
                    {t("admin.recentActivity")}
                  </h2>
                </div>
                <ul className="space-y-3">
                  <ActivityItem
                    title={t("admin.activity.lotUpdated")}
                    subtitle={t("admin.activity.lotUpdatedSub")}
                    color="#2E7D32"
                  />
                  <ActivityItem
                    title={t("admin.activity.newBooking")}
                    subtitle={t("admin.activity.newBookingSub")}
                    color="#0284c7"
                  />
                  <ActivityItem
                    title={t("admin.activity.lotFull")}
                    subtitle={t("admin.activity.lotFullSub")}
                    color="#d32f2f"
                  />
                  <ActivityItem
                    title={t("admin.activity.newAgent")}
                    subtitle={t("admin.activity.newAgentSub")}
                    color="#7c3aed"
                  />
                </ul>
              </div>
            </div>
          )}

          {/* ----- Lots ----- */}
          {activeTab === "lots" && (
            <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-soft overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-[#0f172a]">
                  {t("admin.lots.list")}
                </h2>
                <Button className="gradient-primary text-white rounded-xl gap-2">
                  <PlusCircle className="w-4 h-4" />
                  {t("admin.lots.add")}
                </Button>
              </div>
              <LotsTable lots={parkingLots} />
            </div>
          )}

          {/* ----- Agents ----- */}
          {activeTab === "agents" && (
            <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-soft overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-[#0f172a]">
                  {t("admin.agents.title")}
                </h2>
                <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white gap-2 rounded-xl">
                      <PlusCircle className="w-4 h-4" />
                      {t("admin.agents.add")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("admin.agents.dialog.title")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="agentName">
                          {t("admin.agents.dialog.fullName")}
                        </Label>
                        <Input
                          id="agentName"
                          placeholder={t("admin.agents.dialog.fullNamePlaceholder")}
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agentIdInput">
                          {t("admin.agents.dialog.id")}
                        </Label>
                        <Input
                          id="agentIdInput"
                          placeholder={t("admin.agents.dialog.idPlaceholder")}
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedLot">
                          {t("admin.agents.dialog.lot")}
                        </Label>
                        <select
                          id="assignedLot"
                          className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-white"
                        >
                          <option value="">
                            {t("admin.agents.dialog.selectLot")}
                          </option>
                          {parkingLots.map((lot) => (
                            <option key={lot.id} value={t(lot.nameKey)}>
                              {t(lot.nameKey)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          className="flex-1 gradient-primary text-white rounded-xl"
                          onClick={() => setIsAddAgentOpen(false)}
                        >
                          {t("common.add")}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 rounded-xl border-slate-200"
                          onClick={() => setIsAddAgentOpen(false)}
                        >
                          {t("common.cancel")}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">
                      {t("admin.agents.colName")}
                    </TableHead>
                    <TableHead className="text-start">
                      {t("admin.agents.colId")}
                    </TableHead>
                    <TableHead className="text-start">
                      {t("admin.agents.colLot")}
                    </TableHead>
                    <TableHead className="text-start">
                      {t("admin.agents.colStatus")}
                    </TableHead>
                    <TableHead className="text-start">
                      {t("admin.agents.colActions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full gradient-primary-soft ring-1 ring-[#c8e6c9] flex items-center justify-center text-xs font-bold text-[#2E7D32]">
                            {agent.name.charAt(0)}
                          </div>
                          <span className="font-medium">{agent.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {agent.agentId}
                      </TableCell>
                      <TableCell>{t(agent.lotKey)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            agent.active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              agent.active
                                ? "bg-emerald-500 animate-pulse"
                                : "bg-slate-400"
                            }`}
                          />
                          {agent.active
                            ? t("admin.agents.statusActive")
                            : t("admin.agents.statusInactive")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg"
                            aria-label={t("common.edit")}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                            aria-label={t("common.delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* ----- Analytics ----- */}
          {activeTab === "analytics" && (
            <div className="grid gap-5">
              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-[#0f172a]">
                      {t("admin.analytics.density.title")}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t("admin.analytics.density.sub")}
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={densityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2ef" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        direction: dir,
                        fontSize: 12,
                      }}
                      formatter={(v) => [
                        `${v}%`,
                        t("admin.analytics.density.tooltip"),
                      ]}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {densityData.map((d, i) => (
                        <Cell
                          key={i}
                          fill={
                            d.value >= 90
                              ? "#d32f2f"
                              : d.value >= 75
                              ? "#f59e0b"
                              : "#2E7D32"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-[#0f172a]">
                      {t("admin.analytics.peak.title")}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t("admin.analytics.peak.sub")}
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={peakHoursData}>
                    <defs>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#66bb6a" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#66bb6a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2ef" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        direction: dir,
                        fontSize: 12,
                      }}
                      formatter={(v) => [
                        `${v}%`,
                        t("admin.analytics.density.tooltip"),
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="occupancy"
                      stroke="#2E7D32"
                      strokeWidth={2.5}
                      fill="url(#g2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );

  function LotsTable({
    lots,
    compact,
  }: {
    lots: LotRow[];
    compact?: boolean;
  }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">{t("admin.lots.colName")}</TableHead>
            <TableHead className="text-start">{t("admin.lots.colZone")}</TableHead>
            <TableHead className="text-start">
              {t("admin.lots.colCapacity")}
            </TableHead>
            <TableHead className="text-start">
              {t("admin.lots.colAvailable")}
            </TableHead>
            <TableHead className="text-start">
              {t("admin.lots.colOccupancy")}
            </TableHead>
            <TableHead className="text-start">
              {t("admin.lots.colStatus")}
            </TableHead>
            {!compact && (
              <TableHead className="text-start">
                {t("admin.lots.colActions")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lots.map((lot) => {
            const occupied = lot.capacity - lot.available;
            const percent = Math.round((occupied / lot.capacity) * 100);
            const statusColor =
              lot.available === 0
                ? "#d32f2f"
                : lot.available <= 3
                ? "#b45309"
                : "#2E7D32";
            const statusBg =
              lot.available === 0
                ? "#fee2e2"
                : lot.available <= 3
                ? "#fef3c7"
                : "#dcfce7";
            const statusLabel =
              lot.available === 0
                ? t("admin.lots.statusFull")
                : lot.available <= 3
                ? t("admin.lots.statusAlmost")
                : t("admin.lots.statusAvailable");
            return (
              <TableRow key={lot.id}>
                <TableCell className="font-medium">{t(lot.nameKey)}</TableCell>
                <TableCell>{t(lot.zoneKey)}</TableCell>
                <TableCell>{lot.capacity}</TableCell>
                <TableCell className="font-semibold">{lot.available}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: statusColor,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-end">
                      {percent}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: statusBg, color: statusColor }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: statusColor }}
                    />
                    {statusLabel}
                  </span>
                </TableCell>
                {!compact && (
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg"
                        aria-label={t("common.edit")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                        aria-label={t("common.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

// ---------- Helpers ----------

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: typeof MapPin;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        active
          ? "gradient-primary-soft text-[#2E7D32] ring-1 ring-[#c8e6c9]"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-start">{label}</span>
      {badge !== undefined && (
        <span
          className={`text-[11px] rounded-full px-2 py-0.5 ${
            active
              ? "bg-white/60 text-[#2E7D32]"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  delta,
  trend,
  color,
  bg,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  suffix?: string;
  delta: string;
  trend: "up" | "down";
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2 py-0.5 ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {delta}
        </span>
      </div>
      <div className="text-2xl md:text-3xl font-extrabold text-[#0f172a]">
        {value}
        {suffix && (
          <span className="text-sm font-bold text-slate-500 ms-1">{suffix}</span>
        )}
      </div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function ActivityItem({
  title,
  subtitle,
  color,
}: {
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <div className="text-sm font-semibold text-[#0f172a]">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
    </li>
  );
}
