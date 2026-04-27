import { useI18n, type Lang } from "../../lib/i18n";

type Variant = "default" | "ghost-light";

interface LanguageSwitcherProps {
  variant?: Variant;
}

const ORDER: Lang[] = ["ar", "fr", "en"];
const LABELS: Record<Lang, string> = {
  ar: "AR",
  fr: "FR",
  en: "EN",
};

/**
 * Segmented 3-pill control. Always visible, no dropdown. Clicking AR/FR/EN
 * instantly switches the entire UI (and flips RTL/LTR for AR).
 */
export function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
  const { lang, setLang } = useI18n();

  const wrapperBase =
    "inline-flex items-center rounded-full p-0.5 ring-1 transition-colors";
  const wrapper =
    variant === "ghost-light"
      ? `${wrapperBase} bg-white/15 ring-white/30`
      : `${wrapperBase} bg-white/80 ring-slate-200 backdrop-blur`;

  return (
    <div
      className={wrapper}
      role="group"
      aria-label="Language"
      // Always render the switcher LTR so AR / FR / EN reads consistently
      dir="ltr"
    >
      {ORDER.map((code) => {
        const active = lang === code;
        const activeCls =
          variant === "ghost-light"
            ? "bg-white text-[#2E7D32] shadow"
            : "gradient-primary text-white shadow";
        const idleCls =
          variant === "ghost-light"
            ? "text-white/85 hover:text-white"
            : "text-slate-600 hover:text-[#2E7D32]";
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
              active ? activeCls : idleCls
            }`}
          >
            {LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
