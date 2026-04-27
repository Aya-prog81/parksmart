import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Download,
  Share2,
  MapPin,
  Clock,
  Calendar,
  CreditCard,
  Copy,
  Ticket,
} from "lucide-react";
import { Button } from "../ui/button";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { Logo } from "../shared/Logo";
import { useState } from "react";
import { useI18n } from "../../lib/i18n";

export function DigitalReceipt() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const bookingId = "PKG-2026-0330-1542";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="min-h-screen gradient-hero pb-10">
      {/* Header */}
      <header className="glass border-b border-white/40">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" showText={false} />
          <div className="text-sm font-semibold text-slate-600">
            {t("receipt.step")}
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-8">
        {/* Success */}
        <div className="text-center mb-6 animate-fade-up">
          <div className="relative inline-flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#86efac]/60 animate-pulse-ring" />
            <div className="relative w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-green">
              <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.4} />
            </div>
          </div>
          <h1 className="mt-5 text-3xl md:text-4xl font-extrabold text-[#0f172a]">
            {t("receipt.success")}
          </h1>
          <p className="text-slate-500 mt-2">{t("receipt.successSub")}</p>
        </div>

        {/* Ticket card */}
        <div className="relative animate-fade-up">
          <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-elev overflow-hidden">
            {/* Top banner */}
            <div className="gradient-primary text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs opacity-80">{t("receipt.title")}</div>
                  <div className="font-bold">{t("receipt.brand")}</div>
                </div>
              </div>
              <div className="text-end">
                <div className="text-xs opacity-80">
                  {t("receipt.statusLabel")}
                </div>
                <div className="font-bold inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  {t("receipt.statusConfirmed")}
                </div>
              </div>
            </div>

            {/* Dashed perforation */}
            <div className="relative h-6 bg-white">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-200" />
              <div className="absolute -end-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f0fdf4]" />
              <div className="absolute -start-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f0fdf4]" />
            </div>

            {/* Body */}
            <div className="p-6 md:p-7">
              {/* QR */}
              <div className="flex justify-center mb-5">
                <div className="relative w-52 h-52 bg-white rounded-2xl ring-1 ring-slate-200 p-3">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <rect width="200" height="200" fill="white" />
                    <g fill="#0f172a">
                      {/* Corner markers */}
                      <rect x="10" y="10" width="50" height="50" />
                      <rect x="20" y="20" width="30" height="30" fill="white" />
                      <rect x="25" y="25" width="20" height="20" />
                      <rect x="140" y="10" width="50" height="50" />
                      <rect x="150" y="20" width="30" height="30" fill="white" />
                      <rect x="155" y="25" width="20" height="20" />
                      <rect x="10" y="140" width="50" height="50" />
                      <rect x="20" y="150" width="30" height="30" fill="white" />
                      <rect x="25" y="155" width="20" height="20" />
                      {/* Pattern */}
                      {Array.from({ length: 60 }).map((_, i) => {
                        const x = 70 + (i % 8) * 10;
                        const y = 70 + Math.floor(i / 8) * 10;
                        const show = (i * 37) % 3 !== 0;
                        return show ? (
                          <rect key={i} x={x} y={y} width="8" height="8" />
                        ) : null;
                      })}
                      <rect x="140" y="80" width="8" height="8" />
                      <rect x="150" y="100" width="8" height="8" />
                      <rect x="160" y="120" width="8" height="8" />
                      <rect x="30" y="80" width="8" height="8" />
                      <rect x="40" y="100" width="8" height="8" />
                      <rect x="50" y="120" width="8" height="8" />
                      <rect x="80" y="140" width="8" height="8" />
                      <rect x="100" y="150" width="8" height="8" />
                      <rect x="120" y="160" width="8" height="8" />
                      <rect x="140" y="170" width="8" height="8" />
                      <rect x="160" y="180" width="8" height="8" />
                    </g>
                  </svg>
                  {/* Logo center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center ring-4 ring-white">
                      <span className="text-white font-extrabold">P</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking ID */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2 mb-5">
                <div>
                  <div className="text-[11px] text-slate-500">
                    {t("receipt.bookingId")}
                  </div>
                  <div className="font-mono text-sm font-bold">#{bookingId}</div>
                </div>
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] hover:bg-white px-2.5 py-1.5 rounded-md transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? t("receipt.copied") : t("receipt.copy")}
                </button>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                <DetailCard
                  icon={MapPin}
                  label={t("receipt.lotLabel")}
                  value={t("receipt.lotValue")}
                />
                <DetailCard
                  icon={Calendar}
                  label={t("receipt.dateLabel")}
                  value={t("receipt.dateValue")}
                />
                <DetailCard
                  icon={Clock}
                  label={t("receipt.timeLabel")}
                  value="14:30"
                />
                <DetailCard
                  icon={Clock}
                  label={t("receipt.durationLabel")}
                  value={t("receipt.durationValue")}
                />
                <DetailCard
                  icon={CreditCard}
                  label={t("receipt.payMethodLabel")}
                  value={t("receipt.payMethodValue")}
                />
                <DetailCard
                  icon={Ticket}
                  label={t("receipt.gateLabel")}
                  value={t("receipt.gateValue")}
                />
              </div>

              <div className="mt-5 pt-5 border-t border-dashed border-slate-200 flex items-baseline justify-between">
                <span className="text-sm text-slate-500">
                  {t("receipt.amountPaid")}
                </span>
                <span className="text-2xl font-extrabold text-[#2E7D32]">
                  20{" "}
                  <span className="text-sm font-bold">
                    {t("common.dirham")}
                  </span>
                </span>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-slate-200 gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t("receipt.downloadPdf")}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-slate-200 gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t("receipt.share")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-5 bg-[#e8f5e9] ring-1 ring-[#c8e6c9] rounded-2xl p-4">
          <p className="text-sm text-[#1b5e20] leading-relaxed">
            {t("receipt.tip")}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/user/map")}
            className="h-12 rounded-xl border-slate-200"
          >
            {t("receipt.backToMap")}
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="h-12 rounded-xl gradient-primary text-white"
          >
            {t("receipt.finish")}
          </Button>
        </div>
      </main>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-slate-200 p-3">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="mt-1 font-semibold text-sm text-[#0f172a] truncate">
        {value}
      </div>
    </div>
  );
}
