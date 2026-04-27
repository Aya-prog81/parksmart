import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Heart,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  Navigation,
  Clock,
  Car,
  MapPin,
  Filter,
  Loader2,
  Construction,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { api, ApiLot } from "../../lib/api";
import { useI18n, translateLotName, translateZone } from "../../lib/i18n";
import { IfraneLeafletMap } from "./IfraneLeafletMap";

type Status = "available" | "near-capacity" | "full" | "construction";

interface Lot {
  id: number;
  name: string;
  zone: string;
  distanceKm: number;
  pricePerHour: number;
  available: number;
  total: number;
  latitude?: number | null;
  longitude?: number | null;
  status: Status;
  isAUI: boolean;
}

function statusFor(lot: ApiLot): Status {
  if (/قيد الإنشاء|under construction|en construction/i.test(lot.name))
    return "construction";
  if (lot.available <= 0) return "full";
  if (lot.capacity > 0 && lot.available / lot.capacity < 0.2)
    return "near-capacity";
  return "available";
}

// Rough straight-line distance from Ifrane city centre (km)
function distanceFrom(lat?: number | null, lng?: number | null): number {
  if (lat == null || lng == null) return 0;
  const R = 6371;
  const lat1 = (33.5269 * Math.PI) / 180;
  const lat2 = (lat * Math.PI) / 180;
  const dLat = ((lat - 33.5269) * Math.PI) / 180;
  const dLng = ((lng - -5.1106) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function mapLot(lot: ApiLot): Lot {
  return {
    id: lot.id,
    name: lot.name,
    zone: lot.zone,
    distanceKm: distanceFrom(lot.latitude, lot.longitude),
    pricePerHour: lot.price_per_hour,
    available: lot.available,
    total: lot.capacity,
    latitude: lot.latitude,
    longitude: lot.longitude,
    status: statusFor(lot),
    isAUI: lot.zone.toUpperCase().includes("AUI") || lot.name.includes("AUI"),
  };
}

// Realistic fallback data — matches the new seed
const fallbackLots: Lot[] = [
  { id: 1, name: "AUI - الموقف الرئيسي (P1)", zone: "AUI", distanceKm: 1.3, pricePerHour: 0, available: 42, total: 180, latitude: 33.5388, longitude: -5.1054, status: "available", isAUI: true },
  { id: 2, name: "AUI - موقف المكتبة محمد السادس (P2)", zone: "AUI", distanceKm: 1.2, pricePerHour: 0, available: 18, total: 120, latitude: 33.5374, longitude: -5.1078, status: "near-capacity", isAUI: true },
  { id: 3, name: "AUI - موقف المركز الرياضي (P3)", zone: "AUI", distanceKm: 1.1, pricePerHour: 0, available: 33, total: 95, latitude: 33.5364, longitude: -5.1042, status: "available", isAUI: true },
  { id: 4, name: "AUI - الموقف الجديد (قيد الإنشاء)", zone: "AUI", distanceKm: 1.4, pricePerHour: 0, available: 0, total: 100, latitude: 33.5398, longitude: -5.1085, status: "construction", isAUI: true },
  { id: 5, name: "ساحة المدينة (Place du Marché)", zone: "وسط المدينة", distanceKm: 0.2, pricePerHour: 5, available: 24, total: 80, latitude: 33.5278, longitude: -5.1097, status: "available", isAUI: false },
  { id: 6, name: "شارع الحسن الثاني (Avenue Hassan II)", zone: "وسط المدينة", distanceKm: 0.3, pricePerHour: 6, available: 9, total: 65, latitude: 33.5247, longitude: -5.1112, status: "near-capacity", isAUI: false },
  { id: 7, name: "موقف فندق الميشليفن (Hôtel Michlifen)", zone: "المنطقة السياحية", distanceKm: 0.4, pricePerHour: 10, available: 12, total: 55, latitude: 33.5242, longitude: -5.1080, status: "near-capacity", isAUI: false },
  { id: 8, name: "ساحة الكاتدرائية (Place de la Cathédrale)", zone: "الشمال", distanceKm: 0.3, pricePerHour: 5, available: 4, total: 40, latitude: 33.5260, longitude: -5.1135, status: "near-capacity", isAUI: false },
  { id: 9, name: "الملعب البلدي (Stade Municipal)", zone: "الجنوب", distanceKm: 0.7, pricePerHour: 4, available: 28, total: 60, latitude: 33.5215, longitude: -5.1156, status: "available", isAUI: false },
  { id: 10, name: "شارع محمد الخامس (Avenue Mohammed V)", zone: "وسط المدينة", distanceKm: 0.4, pricePerHour: 6, available: 0, total: 70, latitude: 33.5290, longitude: -5.1145, status: "full", isAUI: false },
  { id: 11, name: "أسد إفران (Lion d'Atlas)", zone: "الغابة", distanceKm: 0.5, pricePerHour: 3, available: 21, total: 35, latitude: 33.5305, longitude: -5.1168, status: "available", isAUI: false },
];

export function UserMapView() {
  const navigate = useNavigate();
  const { t, dir, lang } = useI18n();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "available" | "aui" | "city">("all");
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [parkingLots, setParkingLots] = useState<Lot[]>(fallbackLots);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusMeta = useMemo(
    () => ({
      available: { label: t("common.available"), color: "#16a34a", bg: "#dcfce7", ring: "#86efac" },
      "near-capacity": { label: t("common.almostFull"), color: "#b45309", bg: "#fef3c7", ring: "#fcd34d" },
      full: { label: t("common.full"), color: "#dc2626", bg: "#fee2e2", ring: "#fca5a5" },
      construction: { label: t("common.underConstruction"), color: "#475569", bg: "#f1f5f9", ring: "#cbd5e1" },
    }),
    [t]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.listLots();
        if (!cancelled) {
          const lots = data.map(mapLot);
          setParkingLots(lots);
          if (lots.length > 0) setSelectedLotId(lots[0].id);
        }
      } catch (err) {
        if (!cancelled) setError(t("common.connectError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filtered = parkingLots.filter((l) => {
    let ok = true;
    if (activeFilter === "available") ok = l.status === "available";
    else if (activeFilter === "aui") ok = l.isAUI;
    else if (activeFilter === "city") ok = !l.isAUI;
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      l.name.toLowerCase().includes(q) ||
      l.zone.toLowerCase().includes(q) ||
      translateLotName(l.name, lang).toLowerCase().includes(q) ||
      translateZone(l.zone, lang).toLowerCase().includes(q);
    return ok && matchesSearch;
  });

  // Stats reflect the CURRENT filter, so the user always sees the right numbers
  const zoneTotal = filtered.reduce((s, l) => s + l.total, 0);
  const zoneAvailable = filtered.reduce((s, l) => s + l.available, 0);
  const zoneTaken = zoneTotal - zoneAvailable;
  const zoneLabel =
    activeFilter === "aui"
      ? t("map.filterAUI")
      : activeFilter === "city"
      ? t("map.filterCity")
      : activeFilter === "available"
      ? t("map.filterAvailable")
      : t("map.filterAll");

  // Focus bounds for the Leaflet map. AUI / city use fixed rectangles so the
  // map flies even if the lots haven't loaded yet.
  const AUI_BOUNDS: [[number, number], [number, number]] = [
    [33.5350, -5.1100],
    [33.5410, -5.1030],
  ];
  const CITY_BOUNDS: [[number, number], [number, number]] = [
    [33.5200, -5.1180],
    [33.5310, -5.1075],
  ];
  let focusBounds: [[number, number], [number, number]] | null = null;
  if (activeFilter === "aui") focusBounds = AUI_BOUNDS;
  else if (activeFilter === "city") focusBounds = CITY_BOUNDS;
  else if (activeFilter === "available") {
    const coords = filtered
      .filter((l) => l.latitude != null && l.longitude != null)
      .map((l) => [l.latitude as number, l.longitude as number] as [number, number]);
    if (coords.length >= 2) {
      const lats = coords.map((c) => c[0]);
      const lngs = coords.map((c) => c[1]);
      focusBounds = [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ];
    }
  }

  const HomeArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {loading && (
        <div className="bg-[#e8f5e9] text-[#2E7D32] text-sm flex items-center justify-center gap-2 py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {t("common.loading")}
        </div>
      )}
      {error && !loading && (
        <div className="bg-amber-50 text-amber-700 text-sm text-center py-2 border-b border-amber-200">
          {error}
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-30 glass border-b border-white/40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-slate-200 rounded-xl shrink-0"
              onClick={() => navigate("/")}
            >
              <HomeArrow className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder={t("map.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10 h-11 rounded-xl border-slate-200 bg-white/90"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-200 rounded-xl hidden sm:inline-flex"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-200 rounded-xl"
            >
              <Heart
                className={`w-5 h-5 ${favorites.length > 0 ? "text-red-500 fill-red-500" : ""}`}
              />
            </Button>
            <LanguageSwitcher />
          </div>

          {/* Filters */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 mx-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
            </div>
            {(
              [
                { id: "all", label: t("map.filterAll") },
                { id: "available", label: t("map.filterAvailable") },
                { id: "aui", label: t("map.filterAUI") },
                { id: "city", label: t("map.filterCity") },
              ] as const
            ).map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    active
                      ? "gradient-primary text-white shadow-green"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Zone stats — reflect the current filter */}
          <div className="mt-3 bg-white rounded-2xl p-4 ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">{zoneLabel}</span>
              <span className="text-[10px] font-semibold text-slate-400">
                {filtered.length} {t("map.lots")}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">
                  {t("map.totalSpots")}
                </div>
                <div className="text-xl font-extrabold text-[#0f172a]">{zoneTotal}</div>
              </div>
              <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wide text-emerald-700">
                  {t("map.availableNow")}
                </div>
                <div className="text-xl font-extrabold text-emerald-600">
                  {zoneAvailable}
                </div>
              </div>
              <div className="rounded-xl bg-rose-50 px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wide text-rose-700">
                  {t("map.occupied")}
                </div>
                <div className="text-xl font-extrabold text-rose-600">{zoneTaken}</div>
              </div>
            </div>
            {zoneTotal > 0 && (
              <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round((zoneTaken / zoneTotal) * 100)}%`,
                    background:
                      "linear-gradient(90deg,#16a34a 0%,#f59e0b 60%,#dc2626 100%)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-200 shadow-card bg-white">
          <div className="relative h-[420px] md:h-[520px]">
            <IfraneLeafletMap
              lots={parkingLots.map((l) => ({
                id: l.id,
                name: translateLotName(l.name, lang),
                zone: translateZone(l.zone, lang),
                capacity: l.total,
                available: l.available,
                latitude: l.latitude,
                longitude: l.longitude,
                pricePerHour: l.pricePerHour,
              }))}
              selectedId={selectedLotId}
              onSelect={(id) => setSelectedLotId(id)}
              height="100%"
              focusBounds={focusBounds}
              fitKey={activeFilter}
            />

            {/* Legend (overlay) */}
            <div
              className="absolute bottom-4 end-4 glass rounded-2xl p-3 shadow-card ring-1 ring-white/60 z-[1000]"
              dir={dir}
            >
              <div className="text-[10px] font-semibold text-slate-500 mb-1.5">
                {t("map.zone")}
              </div>
              {(["available", "near-capacity", "full", "construction"] as const).map((s) => (
                <div key={s} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: statusMeta[s].color }}
                  />
                  <span>{statusMeta[s].label}</span>
                </div>
              ))}
            </div>

            {/* Locate me */}
            <Button
              size="icon"
              className="absolute bottom-4 start-4 bg-white hover:bg-slate-50 text-[#2E7D32] ring-1 ring-slate-200 shadow-card rounded-2xl w-11 h-11 z-[1000]"
              title="Locate"
            >
              <Navigation className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Lots list */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#0f172a]">{t("map.title")}</h2>
            <span className="text-xs text-slate-500">
              {filtered.length} {t("map.lots")}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map((lot) => {
              const meta = statusMeta[lot.status];
              const percent = lot.total > 0
                ? Math.round(((lot.total - lot.available) / lot.total) * 100)
                : 0;
              const isFav = favorites.includes(lot.id);
              const isSelected = selectedLotId === lot.id;
              return (
                <article
                  key={lot.id}
                  onClick={() => setSelectedLotId(lot.id)}
                  className={`cursor-pointer bg-white rounded-2xl p-4 ring-1 transition-all ${
                    isSelected
                      ? "ring-2 ring-[#2E7D32] shadow-card"
                      : "ring-slate-200 hover:ring-slate-300 hover:shadow-soft"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: meta.bg }}
                      >
                        {lot.status === "construction" ? (
                          <Construction className="w-5 h-5" style={{ color: meta.color }} />
                        ) : (
                          <MapPin className="w-5 h-5" style={{ color: meta.color }} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#0f172a] truncate">
                          {translateLotName(lot.name, lang)}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                          <span>{translateZone(lot.zone, lang)}</span>
                          <span>·</span>
                          <span>{lot.distanceKm} km</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lot.pricePerHour === 0
                              ? t("common.free")
                              : `${lot.pricePerHour} MAD${t("common.perHour")}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(lot.id);
                      }}
                      className="p-2 -m-2 text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="toggle favorite"
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={isFav ? "currentColor" : "none"}
                        style={{ color: isFav ? "#ef4444" : undefined }}
                      />
                    </button>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: meta.color }}
                      >
                        <Car className="w-3.5 h-3.5" />
                        {lot.available} {t("common.of")} {lot.total} {t("common.spots")}
                      </span>
                      <span className="text-xs text-slate-500">{percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: meta.bg, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <Button
                      size="sm"
                      disabled={lot.status === "full" || lot.status === "construction"}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/user/payment?lotId=${lot.id}&lotName=${encodeURIComponent(translateLotName(lot.name, lang))}&price=${lot.pricePerHour}`
                        );
                      }}
                      className="gradient-primary text-white rounded-xl shadow-green disabled:opacity-50 disabled:shadow-none"
                    >
                      {lot.status === "full"
                        ? t("common.full")
                        : lot.status === "construction"
                        ? t("common.underConstruction")
                        : t("map.bookHere")}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>{t("map.notAvailable")}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
