import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Minus,
  LogOut,
  MapPin,
  Clock,
  Bell,
  Wifi,
  Activity,
} from "lucide-react";
import { Button } from "../ui/button";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { Logo } from "../shared/Logo";
import { useI18n } from "../../lib/i18n";

interface LogEntry {
  time: string;
  action: "in" | "out";
  spots: number;
}

export function AgentDashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [availableSpots, setAvailableSpots] = useState(15);
  const totalSpots = 20;
  const [now, setNow] = useState(new Date());
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: "14:12", action: "in", spots: 15 },
    { time: "14:05", action: "out", spots: 16 },
    { time: "13:54", action: "in", spots: 15 },
  ]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const pushLog = (action: "in" | "out", spots: number) => {
    const time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setLogs((l) => [{ time, action, spots }, ...l].slice(0, 6));
  };

  const handleIncrement = () => {
    if (availableSpots < totalSpots) {
      const v = availableSpots + 1;
      setAvailableSpots(v);
      pushLog("out", v);
    }
  };
  const handleDecrement = () => {
    if (availableSpots > 0) {
      const v = availableSpots - 1;
      setAvailableSpots(v);
      pushLog("in", v);
    }
  };

  const percentFilled = ((totalSpots - availableSpots) / totalSpots) * 100;
  const getStatus = () => {
    if (availableSpots === 0)
      return { text: t("common.full"), color: "#d32f2f", bg: "#fee2e2" };
    if (availableSpots <= 3)
      return {
        text: t("common.almostFull"),
        color: "#b45309",
        bg: "#fef3c7",
      };
    return { text: t("common.available"), color: "#2E7D32", bg: "#dcfce7" };
  };
  const status = getStatus();

  // Progress ring
  const size = 220;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percentFilled / 100) * circumference;

  const timeLabel = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      {/* Header */}
      <header className="relative gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="absolute -end-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="md" showText={false} />
              <div>
                <h1 className="text-xl font-bold">{t("agent.title")}</h1>
                <p className="text-sm text-white/80">{t("agent.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-xs font-medium ring-1 ring-white/15">
                <Wifi className="w-3.5 h-3.5" />
                {t("common.online")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/15 rounded-xl"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <LanguageSwitcher variant="ghost-light" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="text-white hover:bg-white/15 rounded-xl"
                aria-label={t("common.logout")}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <HeaderStat label={t("agent.stats.capacity")} value={`${totalSpots}`} />
            <HeaderStat
              label={t("agent.stats.occupancy")}
              value={`${Math.round(percentFilled)}%`}
            />
            <HeaderStat label={t("agent.stats.time")} value={timeLabel} mono />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-5">
        {/* Main card: counter + ring */}
        <section className="bg-white rounded-3xl ring-1 ring-slate-200 p-6 md:p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#e8f5e9] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-lg text-[#0f172a]">
                {t("agent.lotName")}
              </h2>
              <p className="text-sm text-slate-500">
                {t("agent.lotZone")} · AGT-001
              </p>
            </div>
            <span
              className="ms-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: status.color }}
              />
              {status.text}
            </span>
          </div>

          {/* Ring */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} className="-rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#eef2ef"
                  strokeWidth={stroke}
                  fill="none"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={status.color}
                  strokeWidth={stroke}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - filled}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-[11px] text-slate-500">
                  {t("agent.availableNow")}
                </div>
                <div
                  className="text-5xl font-extrabold leading-none mt-1"
                  style={{ color: status.color }}
                >
                  {availableSpots}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {t("agent.outOf")} {totalSpots}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 w-full">
              <h3 className="font-semibold text-sm text-slate-600 mb-3 text-center md:text-start">
                {t("agent.updateCount")}
              </h3>
              <div className="flex items-center justify-center gap-5">
                <Button
                  onClick={handleDecrement}
                  disabled={availableSpots === 0}
                  className="w-20 h-20 rounded-2xl bg-[#fee2e2] text-[#b91c1c] hover:bg-[#fecaca] disabled:opacity-40 shadow-soft"
                  aria-label={t("agent.aria.carIn")}
                >
                  <Minus className="!w-9 !h-9" strokeWidth={3} />
                </Button>
                <div className="text-center min-w-[100px]">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                    {t("agent.stats.capacity")}
                  </div>
                  <div className="text-4xl font-extrabold text-[#0f172a]">
                    {availableSpots}
                    <span className="text-slate-300">/{totalSpots}</span>
                  </div>
                </div>
                <Button
                  onClick={handleIncrement}
                  disabled={availableSpots === totalSpots}
                  className="w-20 h-20 rounded-2xl bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0] disabled:opacity-40 shadow-soft"
                  aria-label={t("agent.aria.carOut")}
                >
                  <Plus className="!w-9 !h-9" strokeWidth={3} />
                </Button>
              </div>

              <div className="mt-5 bg-slate-50 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                {t("agent.lastUpdate")}{" "}
                <span className="font-semibold text-slate-800 ms-1">
                  {timeLabel}
                </span>
              </div>

              {/* Big bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>{t("agent.currentOccupancy")}</span>
                  <span className="font-semibold text-slate-700">
                    {Math.round(percentFilled)}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentFilled}%`,
                      backgroundColor: status.color,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-[#e8f5e9] ring-1 ring-[#c8e6c9] rounded-2xl p-4">
            <h4 className="font-semibold text-sm mb-2 text-[#1b5e20]">
              {t("agent.tips.title")}
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-md bg-[#dcfce7] text-[#166534] text-xs font-bold flex items-center justify-center">
                  +
                </span>
                <span>
                  {t("agent.tips.line1Pre")}
                  <strong>{t("agent.tips.line1Bold")}</strong>
                  {t("agent.tips.line1Post")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-md bg-[#fee2e2] text-[#b91c1c] text-xs font-bold flex items-center justify-center">
                  −
                </span>
                <span>
                  {t("agent.tips.line2Pre")}
                  <strong>{t("agent.tips.line2Bold")}</strong>
                  {t("agent.tips.line2Post")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-md bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">
                  !
                </span>
                {t("agent.tips.line3")}
              </li>
            </ul>
          </div>
        </section>

        {/* Activity log */}
        <aside className="bg-white rounded-3xl ring-1 ring-slate-200 p-5 shadow-card h-fit">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#2E7D32]" />
            </div>
            <h3 className="font-bold text-[#0f172a]">{t("agent.activityLog")}</h3>
          </div>
          <ul className="space-y-2">
            {logs.map((log, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100 animate-slide-in"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    log.action === "in"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {log.action === "in" ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-[#0f172a]">
                    {log.action === "in" ? t("agent.carIn") : t("agent.carOut")}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t("agent.nowAvailable")} {log.spots} / {totalSpots}
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-mono">{log.time}</div>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}

function HeaderStat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/15 px-4 py-3">
      <div className="text-[11px] text-white/80">{label}</div>
      <div className={`text-xl font-extrabold ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}
