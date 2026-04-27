import { Link } from "react-router";
import {
  Car,
  Shield,
  Users,
  MapPinned,
  Zap,
  Radio,
  BarChart3,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./shared/Logo";
import { LanguageSwitcher } from "./shared/LanguageSwitcher";
import { useI18n } from "../lib/i18n";

export function LandingPage() {
  const { t, lang, dir } = useI18n();

  const features = [
    {
      icon: MapPinned,
      title: t("landing.feature.map.title"),
      description: t("landing.feature.map.desc"),
      color: "#2E7D32",
      bg: "#e8f5e9",
    },
    {
      icon: Zap,
      title: t("landing.feature.book.title"),
      description: t("landing.feature.book.desc"),
      color: "#0284c7",
      bg: "#e0f2fe",
    },
    {
      icon: Radio,
      title: t("landing.feature.live.title"),
      description: t("landing.feature.live.desc"),
      color: "#d97706",
      bg: "#fef3c7",
    },
    {
      icon: BarChart3,
      title: t("landing.feature.analytics.title"),
      description: t("landing.feature.analytics.desc"),
      color: "#7c3aed",
      bg: "#ede9fe",
    },
  ];

  // Stats reflect the actual seeded data (11 lots, ~900 spots)
  const stats = [
    {
      value: "11",
      label: lang === "ar" ? "موقف نشط" : lang === "fr" ? "parkings actifs" : "active lots",
    },
    {
      value: "900+",
      label: lang === "ar" ? "سعة إجمالية" : lang === "fr" ? "places au total" : "total spots",
    },
    {
      value: "24/7",
      label:
        lang === "ar"
          ? "متابعة مستمرة"
          : lang === "fr"
          ? "suivi continu"
          : "live monitoring",
    },
    {
      value: "3",
      label: lang === "ar" ? "لغات" : lang === "fr" ? "langues" : "languages",
    },
  ];

  const roles = [
    {
      to: "/user/login",
      icon: Car,
      title:
        lang === "ar" ? "مستخدم" : lang === "fr" ? "Utilisateur" : "Driver",
      description:
        lang === "ar"
          ? "ابحث عن مواقف متاحة واحجز مكانك بسهولة"
          : lang === "fr"
          ? "Trouvez une place et réservez en quelques secondes"
          : "Find available spots and book your place in seconds",
      cta: t("landing.hero.startUser"),
      highlight: true,
    },
    {
      to: "/agent/login",
      icon: Shield,
      title:
        lang === "ar"
          ? "وكيل ميداني"
          : lang === "fr"
          ? "Agent terrain"
          : "Field agent",
      description:
        lang === "ar"
          ? "إدارة حالة الموقف وتحديث العدد مباشرة"
          : lang === "fr"
          ? "Gérez l'état du parking et mettez à jour les places en temps réel"
          : "Manage your lot's status and update spots in real time",
      cta: t("landing.hero.agentLogin"),
      highlight: false,
    },
    {
      to: "/admin",
      icon: Users,
      title:
        lang === "ar"
          ? "المشرف"
          : lang === "fr"
          ? "Administrateur"
          : "Administrator",
      description:
        lang === "ar"
          ? "لوحة تحكم شاملة وتحليلات متقدمة للمدينة"
          : lang === "fr"
          ? "Tableau de bord complet et analyses avancées"
          : "Full control panel with advanced analytics",
      cta: t("landing.hero.adminLogin"),
      highlight: false,
    },
  ];

  // Inline CTA arrow points outward in the reading direction
  const NextArrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const trustBadges =
    lang === "ar"
      ? ["آمن ومشفر", "يدعم العربية والفرنسية والإنجليزية", "تحديثات لحظية"]
      : lang === "fr"
      ? ["Sécurisé et chiffré", "Disponible en AR / FR / EN", "Mises à jour en direct"]
      : ["Secure & encrypted", "Available in AR / FR / EN", "Live updates"];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 glass border-b border-white/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <a
              href="#roles"
              className="hidden md:inline-flex px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2E7D32] transition-colors"
            >
              {lang === "ar" ? "الأدوار" : lang === "fr" ? "Rôles" : "Roles"}
            </a>
            <a
              href="#features"
              className="hidden md:inline-flex px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2E7D32] transition-colors"
            >
              {lang === "ar" ? "المميزات" : lang === "fr" ? "Fonctions" : "Features"}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-10 pb-20">
        {/* Hero */}
        <section className="relative grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 py-10 md:py-16 animate-fade-up">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f5e9] text-[#2E7D32] px-3 py-1.5 text-xs font-semibold mb-5 ring-1 ring-[#c8e6c9]">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === "ar"
                ? "مشروع جامعة الأخوين · إفران"
                : lang === "fr"
                ? "Projet AUI · Ifrane"
                : "Al Akhawayn University · Ifrane"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#0f172a]">
              <span className="text-gradient-primary">
                {t("landing.hero.title")}
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
              {t("landing.hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/user/login">
                <Button className="h-12 px-6 text-base gradient-primary text-white shadow-green hover:shadow-elev hover:brightness-110 transition-all gap-2">
                  {t("landing.hero.startUser")}
                  <NextArrow className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button
                  variant="outline"
                  className="h-12 px-6 text-base border-[#c8e6c9] bg-white/70 backdrop-blur text-[#2E7D32] hover:bg-white"
                >
                  {t("landing.hero.adminLogin")}
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              {trustBadges.map((b) => (
                <span key={b} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual: stylized parking map */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 gradient-primary-soft blur-3xl opacity-60 -z-10 rounded-[48px]" />
            <div className="relative rounded-3xl bg-white shadow-elev ring-1 ring-slate-200/70 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="text-xs font-medium text-slate-500">
                  {lang === "ar" ? "خريطة · مباشر" : lang === "fr" ? "Carte · Live" : "Map · Live"}
                </div>
              </div>
              <div className="relative aspect-[5/4] bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5]">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 500 400"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern
                      id="dots"
                      width="22"
                      height="22"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="1" cy="1" r="1" fill="#bbf7d0" />
                    </pattern>
                  </defs>
                  <rect width="500" height="400" fill="url(#dots)" />
                  <path d="M 0 140 Q 250 120 500 170" stroke="#ffffff" strokeWidth="14" fill="none" strokeLinecap="round" />
                  <path d="M 0 280 Q 200 250 500 300" stroke="#ffffff" strokeWidth="14" fill="none" strokeLinecap="round" />
                  <path d="M 180 0 Q 170 200 210 400" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
                  <path d="M 360 0 Q 350 200 380 400" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
                </svg>

                <Pin color="#2E7D32" top="18%" left="22%" delay="0s" />
                <Pin color="#f59e0b" top="38%" left="62%" delay=".4s" />
                <Pin color="#2E7D32" top="62%" left="30%" delay=".8s" />
                <Pin color="#ef4444" top="70%" left="70%" delay="1.1s" />
                <Pin color="#2E7D32" top="28%" left="78%" delay="1.4s" />

                <div className="absolute bottom-4 end-4 start-4 glass rounded-2xl p-4 shadow-card ring-1 ring-white/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">
                        {lang === "ar"
                          ? "الأقرب إليك"
                          : lang === "fr"
                          ? "Le plus proche"
                          : "Closest to you"}
                      </div>
                      <div className="font-bold text-slate-900">
                        AUI P1
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-[10px] text-slate-500">{t("common.available")}</div>
                      <div className="font-bold text-[#2E7D32]">42 / 180</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full transition-all"
                      style={{ width: "23%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -start-3 -top-3 bg-white rounded-2xl shadow-elev ring-1 ring-slate-200 px-4 py-3 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500">
                  {lang === "ar" ? "دفع آمن" : lang === "fr" ? "Paiement sécurisé" : "Secure payment"}
                </div>
                <div className="text-sm font-semibold">
                  {lang === "ar" ? "نقداً · بطاقة" : lang === "fr" ? "Espèces · Carte" : "Cash · Card"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 animate-fade-up">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white ring-1 ring-slate-200/70 px-5 py-4 shadow-soft"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-[#0f172a]">
                {s.value}
              </div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {/* Roles */}
        <section id="roles" className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
                {lang === "ar"
                  ? "اختر دورك"
                  : lang === "fr"
                  ? "Choisissez votre rôle"
                  : "Choose your role"}
              </h2>
              <p className="text-slate-500 mt-1">
                {lang === "ar"
                  ? "كل مستخدم لديه تجربته المخصصة"
                  : lang === "fr"
                  ? "Chaque utilisateur a son expérience dédiée"
                  : "Every user has a tailored experience"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {roles.map((role) => (
              <Link to={role.to} key={role.title} className="group block">
                <div
                  className={`relative h-full rounded-2xl p-6 ring-1 ring-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-elev ${
                    role.highlight ? "md:scale-[1.02]" : ""
                  }`}
                >
                  {role.highlight && (
                    <span className="absolute top-4 end-4 inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] text-[#2E7D32] px-2.5 py-1 text-[10px] font-bold">
                      {lang === "ar"
                        ? "موصى به"
                        : lang === "fr"
                        ? "Recommandé"
                        : "Recommended"}
                    </span>
                  )}
                  <div className="w-14 h-14 rounded-2xl gradient-primary-soft flex items-center justify-center mb-5 ring-1 ring-[#c8e6c9]">
                    <role.icon className="w-7 h-7 text-[#2E7D32]" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-1">
                    {role.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {role.description}
                  </p>
                  <Button className="w-full gradient-primary text-white h-11 group-hover:brightness-110 transition-all">
                    {role.cta}
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-16">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
              {t("landing.features.title")}
            </h2>
            <p className="text-slate-500 mt-1">
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-5 ring-1 ring-slate-200 bg-white hover:shadow-card transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-[#0f172a] mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-16 relative overflow-hidden rounded-3xl gradient-primary px-6 md:px-12 py-10 md:py-14 text-white">
          <div className="absolute inset-0 opacity-20 bg-grid pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">
                {lang === "ar"
                  ? "ابدأ رحلتك في إفران بدون قلق من المواقف"
                  : lang === "fr"
                  ? "Commencez votre voyage à Ifrane sans souci de stationnement"
                  : "Start your trip in Ifrane without parking worries"}
              </h3>
              <p className="mt-2 text-white/85 max-w-xl">
                {lang === "ar"
                  ? "انضم إلى مئات السائقين الذين يوفرون وقتهم يومياً باستخدام النظام."
                  : lang === "fr"
                  ? "Rejoignez les centaines de conducteurs qui gagnent du temps chaque jour."
                  : "Join hundreds of drivers saving time every day with our system."}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/user/login">
                <Button className="h-12 px-6 bg-white text-[#2E7D32] hover:bg-white/90">
                  {t("landing.hero.findNow")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <span>
              ©{" 2026 "}
              {t("landing.brand")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              {lang === "ar"
                ? "مشروع تخرج"
                : lang === "fr"
                ? "Projet de fin d'études"
                : "Capstone project"}
            </span>
            <span>·</span>
            <span>Al Akhawayn · Ifrane</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Pin({
  color,
  top,
  left,
  delay,
}: {
  color: string;
  top: string;
  left: string;
  delay: string;
}) {
  return (
    <div
      className="absolute"
      style={{ top, left, transform: "translate(-50%, -100%)" }}
    >
      <span
        className="absolute inset-0 rounded-full animate-ripple"
        style={{ backgroundColor: color, animationDelay: delay }}
      />
      <div
        className="relative w-6 h-6 rounded-full ring-4 ring-white shadow-lg"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
