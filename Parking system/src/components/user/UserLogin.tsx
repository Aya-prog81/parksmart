import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Logo } from "../shared/Logo";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { api, ApiError } from "../../lib/api";
import { useI18n } from "../../lib/i18n";

export function UserLogin() {
  const navigate = useNavigate();
  const { t, lang, dir } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await api.login({ email: username, password });
      } else {
        await api.register({
          full_name: fullName,
          email: username,
          password,
        });
      }
      navigate("/user/map");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t("auth.error.generic");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Arrow points back home in the current reading direction
  const HomeArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const placeholderName =
    lang === "ar" ? "فيروز" : lang === "fr" ? "Fairouz" : "Fairouz";

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
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

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary-soft ring-1 ring-[#c8e6c9] mb-4">
              <User className="w-8 h-8 text-[#2E7D32]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a]">
              {mode === "login" ? t("auth.user.welcome") : t("auth.user.createTitle")}
            </h1>
            <p className="text-slate-500 mt-2">
              {mode === "login" ? t("auth.user.welcomeSub") : t("auth.user.createSub")}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-7 shadow-elev ring-1 ring-slate-200/70">
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-700">
                    {t("common.fullName")}
                  </Label>
                  <div className="relative">
                    <User className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={placeholderName}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pe-11 h-12 rounded-xl border-slate-200 focus-visible:ring-[#2E7D32]/30"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700">
                  {t("common.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="username"
                    type="email"
                    placeholder="example@aui.ma"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pe-11 h-12 rounded-xl border-slate-200 focus-visible:ring-[#2E7D32]/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">
                    {t("common.password")}
                  </Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-xs font-medium text-[#2E7D32] hover:underline"
                    >
                      {t("auth.user.forgot")}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pe-11 ps-11 h-12 rounded-xl border-slate-200 focus-visible:ring-[#2E7D32]/30"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="toggle password"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="appearance-none w-5 h-5 rounded-md border-2 border-slate-300 checked:bg-[#2E7D32] checked:border-[#2E7D32] transition-colors"
                  />
                  {t("auth.user.remember")}
                </label>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-white h-12 text-base rounded-xl shadow-green hover:brightness-110 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : mode === "login" ? (
                  t("common.login")
                ) : (
                  t("common.register")
                )}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400">
                    {t("auth.user.or")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-slate-200 gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {t("auth.user.viaPhone")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-slate-200 gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t("auth.user.viaEmail")}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {mode === "login" ? t("auth.user.noAccount") : t("auth.user.haveAccount")}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError(null);
                }}
                className="text-[#2E7D32] font-semibold hover:underline"
              >
                {mode === "login" ? t("auth.user.createNew") : t("common.login")}
              </button>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            {t("auth.user.terms")}
          </p>
        </div>
      </main>
    </div>
  );
}
