import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Banknote,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  Lock,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { useI18n } from "../../lib/i18n";

type PaymentMethod = "cash" | "card" | null;

export function PaymentSelection() {
  const navigate = useNavigate();
  const { t, dir } = useI18n();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/user/receipt");
  };

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/^(\d{2})(\d)/, "$1/$2");

  const BackArrow = dir === "rtl" ? ChevronRight : ChevronLeft;

  return (
    <div className="min-h-screen gradient-hero pb-10">
      {/* Header */}
      <header className="glass border-b border-white/40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#2E7D32]"
          >
            <BackArrow className="w-4 h-4" />
            {t("common.back")}
          </button>
          <div className="text-sm font-semibold text-slate-600">
            {t("pay.step")}
          </div>
          <LanguageSwitcher />
        </div>

        {/* progress */}
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-2">
            <Step label={t("pay.steps.choose")} done />
            <StepLine done />
            <Step label={t("pay.steps.pay")} active />
            <StepLine />
            <Step label={t("pay.steps.confirm")} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
          {t("pay.title")}
        </h1>
        <p className="text-slate-500 mt-1">{t("pay.subtitle")}</p>

        <form
          onSubmit={handlePayment}
          className="mt-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-5"
        >
          <div className="space-y-4">
            {/* Method toggle */}
            <div className="grid grid-cols-2 gap-3">
              <MethodCard
                icon={CreditCard}
                title={t("pay.method.card")}
                subtitle={t("pay.method.cardSub")}
                selected={paymentMethod === "card"}
                onClick={() => setPaymentMethod("card")}
              />
              <MethodCard
                icon={Banknote}
                title={t("pay.method.cash")}
                subtitle={t("pay.method.cashSub")}
                selected={paymentMethod === "cash"}
                onClick={() => setPaymentMethod("cash")}
              />
            </div>

            {/* Card details */}
            {paymentMethod === "card" && (
              <div className="bg-white rounded-3xl ring-1 ring-slate-200 p-5 space-y-5 animate-fade-up">
                {/* Card preview */}
                <div className="relative aspect-[16/9] max-h-[200px] rounded-2xl p-5 text-white overflow-hidden shadow-elev">
                  <div className="absolute inset-0 gradient-primary" />
                  <div className="absolute -end-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
                  <div className="absolute -start-8 -bottom-8 w-36 h-36 rounded-full bg-white/10" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-7 rounded-md bg-yellow-300/80" />
                      <span className="text-xs font-semibold tracking-wider opacity-80">
                        IFRANE PAY
                      </span>
                    </div>
                    <div className="text-xl md:text-2xl font-mono tracking-widest">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex items-end justify-between text-xs">
                      <div>
                        <div className="opacity-70 text-[10px]">
                          {t("pay.card.holder")}
                        </div>
                        <div className="font-semibold tracking-wide uppercase">
                          {cardHolder || "YOUR NAME"}
                        </div>
                      </div>
                      <div>
                        <div className="opacity-70 text-[10px]">
                          {t("pay.card.expiry")}
                        </div>
                        <div className="font-semibold">{expiry || "MM/YY"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">{t("pay.card.numberLabel")}</Label>
                  <div className="relative">
                    <CreditCard className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="cardNumber"
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCard(e.target.value))}
                      className="pe-10 h-12 rounded-xl border-slate-200 tracking-wider"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardHolder">{t("pay.card.holderLabel")}</Label>
                  <Input
                    id="cardHolder"
                    type="text"
                    placeholder="FIRST LAST"
                    value={cardHolder}
                    onChange={(e) =>
                      setCardHolder(e.target.value.toUpperCase())
                    }
                    className="h-12 rounded-xl border-slate-200 tracking-wide"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">{t("pay.card.expiryLabel")}</Label>
                    <Input
                      id="expiry"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="h-12 rounded-xl border-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">{t("pay.card.cvvLabel")}</Label>
                    <div className="relative">
                      <Lock className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="cvv"
                        type="password"
                        inputMode="numeric"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                        }
                        className="pe-10 h-12 rounded-xl border-slate-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  {t("pay.card.secure")}
                </div>
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="bg-white rounded-3xl ring-1 ring-slate-200 p-6 animate-fade-up">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#fef3c7] flex items-center justify-center shrink-0">
                    <Banknote className="w-6 h-6 text-[#b45309]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f172a]">
                      {t("pay.cash.title")}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {t("pay.cash.descPre")}
                      <strong>{t("pay.cash.descBold")}</strong>
                      {t("pay.cash.descPost")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="space-y-4">
            <div className="bg-white rounded-3xl ring-1 ring-slate-200 p-5 shadow-card sticky top-4">
              <h3 className="font-bold text-[#0f172a] mb-4">
                {t("pay.summary.title")}
              </h3>

              <SummaryRow
                icon={MapPin}
                label={t("pay.summary.lot")}
                value={t("pay.summary.lotValue")}
              />
              <SummaryRow
                icon={Calendar}
                label={t("pay.summary.date")}
                value={t("pay.summary.dateValue")}
              />
              <SummaryRow
                icon={Clock}
                label={t("pay.summary.duration")}
                value={t("pay.summary.durationValue")}
              />

              <div className="my-4 border-t border-dashed border-slate-200" />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{t("pay.summary.hourPrice")}</span>
                  <span>10 {t("common.dirham")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t("pay.summary.hours")}</span>
                  <span>×2</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t("pay.summary.serviceFee")}</span>
                  <span className="text-[#2E7D32]">
                    {t("pay.summary.serviceFree")}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-sm text-slate-500">
                  {t("pay.summary.total")}
                </span>
                <span className="text-2xl font-extrabold text-[#2E7D32]">
                  20{" "}
                  <span className="text-sm font-bold">
                    {t("common.dirham")}
                  </span>
                </span>
              </div>

              <Button
                type="submit"
                className="mt-5 w-full h-12 rounded-xl gradient-primary text-white text-base shadow-green hover:brightness-110"
                disabled={!paymentMethod}
              >
                {paymentMethod === "card"
                  ? t("pay.payNow")
                  : t("pay.confirm")}
              </Button>

              <div className="mt-3 text-center text-[11px] text-slate-400 inline-flex items-center justify-center gap-1 w-full">
                <ShieldCheck className="w-3 h-3" />
                {t("pay.protection")}
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}

function MethodCard({
  icon: Icon,
  title,
  subtitle,
  selected,
  onClick,
}: {
  icon: typeof CreditCard;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-start rounded-2xl p-4 ring-1 transition-all ${
        selected
          ? "ring-2 ring-[#2E7D32] bg-[#e8f5e9] shadow-card"
          : "ring-slate-200 bg-white hover:ring-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            selected ? "gradient-primary text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-[#0f172a]">{title}</div>
          <div className="text-xs text-slate-500">{subtitle}</div>
        </div>
      </div>
      <span
        className={`absolute top-4 end-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? "border-[#2E7D32]" : "border-slate-300"
        }`}
      >
        {selected && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
        )}
      </span>
    </button>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#2E7D32]" />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-sm font-semibold text-[#0f172a]">{value}</span>
      </div>
    </div>
  );
}

function Step({
  label,
  active,
  done,
}: {
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ring-2 ${
          done
            ? "bg-[#2E7D32] text-white ring-[#2E7D32]"
            : active
            ? "bg-white text-[#2E7D32] ring-[#2E7D32]"
            : "bg-white text-slate-400 ring-slate-200"
        }`}
      >
        {done ? "✓" : ""}
      </div>
      <span
        className={`text-xs font-medium ${
          active || done ? "text-[#0f172a]" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function StepLine({ done }: { done?: boolean }) {
  return (
    <div className="flex-1 h-0.5 rounded-full bg-slate-200 overflow-hidden">
      <div
        className="h-full gradient-primary transition-all"
        style={{ width: done ? "100%" : "0%" }}
      />
    </div>
  );
}
