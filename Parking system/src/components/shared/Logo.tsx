import { Car } from "lucide-react";
import { useI18n } from "../../lib/i18n";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const { t } = useI18n();
  const sizes = {
    sm: { box: "w-8 h-8", icon: "w-4 h-4", text: "text-base" },
    md: { box: "w-11 h-11", icon: "w-6 h-6", text: "text-lg" },
    lg: { box: "w-16 h-16", icon: "w-9 h-9", text: "text-2xl" },
  }[size];

  return (
    <div className="inline-flex items-center gap-3">
      <div
        className={`${sizes.box} rounded-xl gradient-primary flex items-center justify-center shadow-green ring-1 ring-white/50`}
      >
        <Car className={`${sizes.icon} text-white`} strokeWidth={2.4} />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold text-[#0f172a] ${sizes.text}`}>
            {t("common.brand")}
          </span>
          <span className="text-[11px] font-medium text-[#2E7D32] tracking-wide">
            IFRANE · SMART PARKING
          </span>
        </div>
      )}
    </div>
  );
}
