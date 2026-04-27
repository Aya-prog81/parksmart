import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Shield,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Fingerprint,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { Logo } from "../shared/Logo";
import { useI18n } from "../../lib/i18n";

export function AgentLogin() {
  const navigate = useNavigate();
  const { t, dir } = useI18n();
  const [agentId, setAgentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/agent/dashboard");
  };

  const HomeArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass border-b border-white/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-[#2E7D32] font-medium"
          >
            <HomeArrow className="w-4 h-4" />
            {t("common.home")}
          </Link>
          <Logo size="md" showText={false} />
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left: form */}
        <div className="gradient-hero flex items-center justify-center p-4">
          <div className="w-full max-w-md animate-fade-up">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary-soft ring-1 ring-[#c8e6c9] mb-4">
                <Shield className="w-8 h-8 text-[#2E7D32]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">
                {t("agentLogin.portalTitle")}
              </h1>
              <p className="text-slate-500 mt-2">
                {t("agentLogin.portalSubtitle")}
              </p>
            </div>

            <div className="bg-white/85 backdrop-blur rounded-3xl p-7 shadow-elev ring-1 ring-slate-200/70">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="agentId">{t("agentLogin.idLabel")}</Label>
                  <div className="relative">
                    <Shield className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="agentId"
                      type="text"
                      placeholder="AGT-0000"
                      value={agentId}
                      onChange={(e) => setAgentId(e.target.value)}
                      className="pe-11 h-12 rounded-xl border-slate-200 tracking-wide uppercase"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("common.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pe-11 ps-11 h-12 rounded-xl border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary text-white h-12 text-base rounded-xl shadow-green hover:brightness-110 transition-all"
                >
                  {t("agentLogin.enter")}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400">
                      {t("agentLogin.or")}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-slate-200 gap-2"
                >
                  <Fingerprint className="w-5 h-5" />
                  {t("agentLogin.fingerprint")}
                </Button>
              </form>

              <div className="mt-5 bg-[#e8f5e9] ring-1 ring-[#c8e6c9] rounded-xl px-4 py-3">
                <p className="text-xs text-[#1b5e20] text-center leading-relaxed">
                  {t("agentLogin.notice")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="hidden lg:flex relative items-center justify-center gradient-primary p-12 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative text-white max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold mb-5 backdrop-blur">
              <Shield className="w-3.5 h-3.5" />
              {t("agentLogin.protectedZone")}
            </div>
            <h2 className="text-4xl font-extrabold leading-tight">
              {t("agentLogin.heroTitle")}
            </h2>
            <p className="mt-4 text-white/85 leading-relaxed">
              {t("agentLogin.heroDesc")}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { v: "<1s", l: t("agentLogin.stat.updateTime") },
                { v: "24/7", l: t("agentLogin.stat.monitoring") },
                { v: "100%", l: t("agentLogin.stat.protection") },
              ].map((x) => (
                <div
                  key={x.l}
                  className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 ring-1 ring-white/15"
                >
                  <div className="text-xl font-extrabold">{x.v}</div>
                  <div className="text-[11px] opacity-80">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
