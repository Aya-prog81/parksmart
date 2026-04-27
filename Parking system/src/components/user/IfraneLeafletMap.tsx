/**
 * Real Leaflet map of Ifrane + Al Akhawayn University.
 * Loads Leaflet from CDN (see index.html) and exposes it on window.L.
 *
 * Each lot is drawn as a colored circle marker:
 *   green  → plenty of space
 *   amber  → almost full
 *   red    → full
 *   grey   → under construction
 */
import { useEffect, useRef } from "react";

// Tell TS that Leaflet is loaded globally via CDN
declare global {
  interface Window {
    L: any;
  }
}

export interface MapLot {
  id: number;
  name: string;
  zone: string;
  capacity: number;
  available: number;
  latitude?: number | null;
  longitude?: number | null;
  pricePerHour?: number;
}

interface Props {
  lots: MapLot[];
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  /** Map height (CSS string), defaults to 100% */
  height?: string;
  /** When set, the map flies to fit these [[lat,lng], [lat,lng]] corners */
  focusBounds?: [[number, number], [number, number]] | null;
  /** Force a refit to the visible markers (e.g. when filter changes) */
  fitKey?: string | number;
}

// Center between AUI campus (33.5378, -5.1062) and Ifrane city (33.5269, -5.1106)
const DEFAULT_CENTER: [number, number] = [33.5325, -5.1085];
const DEFAULT_ZOOM = 14;

function colorFor(lot: MapLot): { fill: string; stroke: string; label: string } {
  const isConstruction = /قيد الإنشاء|under construction|en construction/i.test(lot.name);
  if (isConstruction) return { fill: "#94a3b8", stroke: "#475569", label: "🚧" };
  const ratio = lot.capacity > 0 ? lot.available / lot.capacity : 0;
  if (lot.available === 0) return { fill: "#dc2626", stroke: "#991b1b", label: "✕" };
  if (ratio < 0.2) return { fill: "#f59e0b", stroke: "#b45309", label: String(lot.available) };
  return { fill: "#16a34a", stroke: "#15803d", label: String(lot.available) };
}

export function IfraneLeafletMap({
  lots,
  selectedId,
  onSelect,
  height = "100%",
  focusBounds,
  fitKey,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());

  // Init map once
  useEffect(() => {
    let cancelled = false;

    const tryInit = () => {
      if (cancelled) return;
      if (!window.L) {
        // CDN script not yet loaded — retry shortly
        setTimeout(tryInit, 80);
        return;
      }
      if (mapRef.current || !containerRef.current) return;

      const L = window.L;
      const map = L.map(containerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Static labels for the two main areas
      const labelHtml = (text: string, color: string) =>
        `<div style="background:${color};color:white;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.25)">${text}</div>`;

      L.marker([33.5390, -5.1062], {
        icon: L.divIcon({
          className: "ifrane-area-label",
          html: labelHtml("AUI Campus", "#1e3a8a"),
          iconSize: [80, 22],
          iconAnchor: [40, 11],
        }),
        interactive: false,
      }).addTo(map);

      L.marker([33.5260, -5.1110], {
        icon: L.divIcon({
          className: "ifrane-area-label",
          html: labelHtml("Ifrane Centre", "#7c2d12"),
          iconSize: [90, 22],
          iconAnchor: [45, 11],
        }),
        interactive: false,
      }).addTo(map);

      mapRef.current = map;
    };

    tryInit();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  // Draw / update markers when lots change
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L) return;

    // Remove markers for lots that no longer exist
    const existingIds = new Set(lots.map((l) => l.id));
    for (const [id, marker] of markersRef.current.entries()) {
      if (!existingIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    for (const lot of lots) {
      if (lot.latitude == null || lot.longitude == null) continue;
      const { fill, stroke, label } = colorFor(lot);
      const isSelected = selectedId === lot.id;

      const html = `
        <div class="ifrane-pin" style="
          width:38px;height:38px;border-radius:9999px;
          background:${fill};border:3px solid ${isSelected ? "#0f172a" : stroke};
          color:white;font-weight:700;font-size:13px;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 10px rgba(0,0,0,.25);
          transform:${isSelected ? "scale(1.15)" : "scale(1)"};
          transition:transform .15s ease;
          cursor:pointer;
        ">${label}</div>`;

      const icon = L.divIcon({
        className: "",
        html,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const popupHtml = `
        <div style="font-family:system-ui,sans-serif;min-width:200px">
          <div style="font-weight:700;font-size:14px;color:#0f172a;margin-bottom:4px">${escapeHtml(lot.name)}</div>
          <div style="font-size:12px;color:#475569;margin-bottom:6px">${escapeHtml(lot.zone)}</div>
          <div style="display:flex;gap:6px;align-items:center;font-size:12px">
            <span style="background:${fill};color:white;padding:2px 8px;border-radius:9999px;font-weight:600">
              ${lot.available} / ${lot.capacity}
            </span>
            ${lot.pricePerHour != null
              ? `<span style="color:#475569">${lot.pricePerHour === 0 ? "Free" : lot.pricePerHour + " MAD/hr"}</span>`
              : ""}
          </div>
        </div>`;

      const existing = markersRef.current.get(lot.id);
      if (existing) {
        existing.setLatLng([lot.latitude, lot.longitude]);
        existing.setIcon(icon);
        existing.setPopupContent(popupHtml);
      } else {
        const marker = L.marker([lot.latitude, lot.longitude], { icon })
          .addTo(map)
          .bindPopup(popupHtml);

        marker.on("click", () => {
          if (onSelect) onSelect(lot.id);
        });

        markersRef.current.set(lot.id, marker);
      }
    }

    // Initial fit-all on first marker draw (only if not driven by focusBounds)
    const coords = lots
      .filter((l) => l.latitude != null && l.longitude != null)
      .map((l) => [l.latitude as number, l.longitude as number] as [number, number]);
    if (coords.length >= 2 && !selectedId && !focusBounds && fitKey == null) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds.pad(0.2));
    }
  }, [lots, selectedId, onSelect, focusBounds, fitKey]);

  // Fly to focusBounds (used when filter changes)
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L) return;
    if (focusBounds) {
      const bounds = L.latLngBounds(focusBounds);
      map.flyToBounds(bounds.pad(0.25), { duration: 0.7, maxZoom: 17 });
    } else if (fitKey != null) {
      // Refit to current visible markers
      const coords = lots
        .filter((l) => l.latitude != null && l.longitude != null)
        .map((l) => [l.latitude as number, l.longitude as number] as [number, number]);
      if (coords.length >= 2) {
        const bounds = L.latLngBounds(coords);
        map.flyToBounds(bounds.pad(0.2), { duration: 0.7 });
      } else if (coords.length === 1) {
        map.flyTo(coords[0], 16, { duration: 0.7 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusBounds, fitKey]);

  // Pan to selected lot
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const lot = lots.find((l) => l.id === selectedId);
    if (lot && lot.latitude != null && lot.longitude != null) {
      map.flyTo([lot.latitude, lot.longitude], Math.max(map.getZoom(), 16), {
        duration: 0.6,
      });
    }
  }, [selectedId, lots]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height, minHeight: 300, borderRadius: "1rem", overflow: "hidden" }}
      className="bg-slate-100 ring-1 ring-slate-200/70 z-0"
    />
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
