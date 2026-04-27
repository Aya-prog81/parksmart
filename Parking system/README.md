# نظام مواقف إفران الذكي — Ifrane Smart Parking

Modern, RTL-first front-end for a smart parking management system in Ifrane, Morocco. Built with React + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + Recharts.

## ✨ Design improvements over the original

This rebuild preserves the original Figma structure and Arabic content but upgrades the visual language and UX:

- **Hero section** on the landing page with a gradient mesh background, animated parking map preview, live status ripples, and floating trust-badges.
- **Unified logo + language switcher** as shared components (`src/components/shared/`), so every screen stays consistent.
- **Glassmorphism top bars** with sticky navigation and progressive disclosure of controls.
- **Richer map view**: curved roads, building blocks, a pulsing user-location pin, animated parking pins with live counts, filter chips, and a progress bar per lot.
- **Payment screen redesigned** as a 3-step checkout with a live credit-card preview, auto-formatted card number/expiry, step indicator, and a sticky order summary.
- **Receipt redesigned** as a ticket with perforated edge, logo-embedded QR, copyable booking ID, detail cards, and contextual tips.
- **Agent dashboard** upgraded with a circular progress ring, big tactile +/- buttons, an activity log, status pill, and live capacity bar.
- **Admin dashboard** fully reworked with a left sidebar, an Overview tab (Area + Pie + activity feed), trend deltas on every stat card, and color-graded occupancy bars in tables.
- **Motion + polish**: `fade-up`, `slide-in`, `float`, `pulse-ring`, and `ripple` keyframes; consistent shadow scale (`shadow-soft`, `shadow-card`, `shadow-green`, `shadow-elev`).
- **Accessibility**: visible focus rings, semantic landmarks (`header`, `main`, `aside`, `section`), larger tap targets, and reduced text on busy screens.

## 🚀 Getting started

Prerequisites: **Node.js 18+** and **npm 9+**.

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (opens http://localhost:5173)
npm run dev

# 3. Production build
npm run build
npm run preview
```

## 🗺️ Routes

| Route                | Screen             |
| -------------------- | ------------------ |
| `/`                  | Landing            |
| `/user/map`          | Parking map + list |
| `/user/login`        | User login         |
| `/user/payment`      | Payment checkout   |
| `/user/receipt`      | Digital receipt    |
| `/agent/login`       | Agent login        |
| `/agent/dashboard`   | Agent dashboard    |
| `/admin`             | Admin dashboard    |

## 🎨 Theme

Primary color: `#2E7D32` (Ifrane cedar green). Accent: `#e8f5e9`. Destructive: `#d32f2f`. Warning: `#f59e0b`. Fonts: `IBM Plex Sans Arabic` + `Inter`.

All CSS tokens live in `src/styles/globals.css`. Tailwind v4 reads them via `@theme inline`.

## 📂 Project structure

```
src/
├── App.tsx                     # Router provider
├── routes.tsx                  # Route definitions
├── main.tsx                    # Entry point
├── styles/globals.css          # Tokens, utilities, animations
└── components/
    ├── LandingPage.tsx
    ├── shared/                 # Logo, LanguageSwitcher
    ├── user/                   # UserLogin, UserMapView, PaymentSelection, DigitalReceipt
    ├── agent/                  # AgentLogin, AgentDashboard
    ├── admin/                  # AdminDashboard
    ├── figma/                  # ImageWithFallback
    └── ui/                     # shadcn/ui primitives
```

## 🌐 Languages

The language switcher (AR / FR / EN) is wired up as state. To enable full i18n, swap the switcher's `useState` for `react-i18next` and move page strings into resource files.

## 📝 Notes

- Routes are client-side (`react-router v7`). If you deploy to a static host, configure SPA fallback to `index.html`.
- Charts use Recharts. Colors are sourced from the green palette in CSS variables.
- The map is stylised SVG — plug in Mapbox GL or Leaflet later by replacing the SVG block in `UserMapView.tsx`.

