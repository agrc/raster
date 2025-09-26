# Raster Data Discovery – Agent Onboarding Guide

## What this app does

- Public-facing React single-page app for https://raster.utah.gov that lets users browse, visualize, and download Utah raster datasets.
- Uses the ArcGIS JS API to render an interactive map and a Utah Design System (UDS) shell for layout, theming, Firebase analytics, and shared UI pieces.
- Served statically (Firebase Hosting) with build artifacts in `dist/`; esri assets and localized strings live under `public/assets`.

## Tech stack at a glance

- **Runtime:** TypeScript + React 19, Vite 6, ESM-only (`"type": "module"`).
- **Map tooling:** `@arcgis/core` + `@arcgis/map-components` for map + widgets; `esriConfig.assetsPath = './assets'` expects copied ArcGIS assets.
- **Design system:** `@ugrc/utah-design-system` (Header/Footer, Drawer, Firebase providers, LayerSelector, etc.) and `@ugrc/utilities` hooks (map extent, graphics management).
- **Styling:** Tailwind CSS with `@ugrc/tailwind-preset`; additional global styles in `src/index.css`.
- **Build/test:** Vite (dev/build/preview), TypeScript project refs (`tsc -b`), Vitest (`happy-dom`), ESLint (`@ugrc/eslint-config`), Prettier (+ organize imports, Tailwind plugin).
- **Hosting:** Firebase (`firebase.json` sets headers + SPA rewrite). `copy:arcgis` script mirrors ArcGIS static assets into `public/assets` when dependencies bump.

## Project structure

```
root
├── src/
│   ├── main.tsx              // App bootstrap, Firebase config parsing, MapProvider
│   ├── App.tsx               // Layout shell, error boundary, Layer drawer
│   ├── config.ts             // Central UI constants
│   └── components/           // Shared UI pieces (buttons, modals, etc.)
├── public/
│   ├── index.html            // Root document, theme metadata
│   └── assets/               // Copied ArcGIS/UDS assets, fonts, localization bundles
├── .github/                  // Automation metadata (add files here, e.g., this guide)
├── package.json              // Scripts + deps (pnpm preferred; `pnpm-lock.yaml` present)
├── tailwind.config.js        // Uses UDS preset + heading font override
├── tsconfig.*.json           // Extend `@ugrc/tsconfigs`
├── vite.config.ts            // React plugin, package-version injector, dedupe settings
├── eslint.config.js | postcss.config.js | firebase.json
└── CHANGELOG.md, README.md   // Release log + minimal overview
```

Large vendor bundles live in `public/assets/esri` & `public/assets/components`; avoid editing them manually—run `pnpm copy:arcgis` if ArcGIS bits change.

## Environment & secrets

- Vite env vars are defined in `src/vite-env.d.ts`:
  - `VITE_DISCOVER`: Quad-word token for UGRC Discover services, required for `LayerSelector` basemaps.
  - `VITE_FIREBASE_CONFIG`: JSON stringified config; parsed in `main.tsx` and fed to `FirebaseAppProvider`.
  - `PACKAGE_VERSION`: injected automatically by `vite-plugin-package-version` during build.
- Create a local `.env` (or `.env.local`) with the two `VITE_*` vars before running the map. Missing values won’t hard-crash, but Discover layers won’t populate and Firebase remains stubbed (a warning is logged when trying to use map helpers without a `MapView`).
- Firebase performance is lazy-loaded; ensure analytics config aligns with hosting project before enabling in production.

## Getting set up quickly

1. **Install Node ≥ 20.11** (aligns with Vite 6 + latest pnpm). Use `corepack enable` or manually install pnpm.
2. **Install deps:** `pnpm install` (preferred). Using `npm` will ignore the lockfile and can break the `copy:arcgis` path assumptions.
3. **ArcGIS assets:** after fresh installs or ArcGIS version bumps, run `pnpm copy:arcgis` to sync `node_modules/@arcgis/core/assets` → `public/assets`.
4. **Start dev server:** `pnpm start` (alias for `vite`).
5. **Preview production build:** `pnpm preview` after `pnpm build`.

## Build, quality, and validation

- **Type checking:** `pnpm check` (runs `tsc -b` against `tsconfig.browser.json` + `tsconfig.vite-config.json`). Fix TS issues before shipping; unchecked map typings quickly lead to runtime errors.
- **Tests:** `pnpm test` runs Vitest in watch mode; use `pnpm test run` for a single pass (handy in CI). Vitest uses `happy-dom`; no DOM globals are auto-exposed outside tests, so import `@testing-library` helpers as needed.
- **Lint:** `pnpm lint`. ESLint config extends UGRC rules; they already handle React 19 + hooks.
- **Formatting:** `pnpm format`. Prettier plugin auto-sorts imports; avoid manual grouping to prevent churn.
- **CI expectations:** builds run `tsc -b && vite build`; ensure new TS paths are covered. Firebase deploys expect `dist/` + up-to-date headers in `firebase.json`.

## Coding guidelines and conventions

- Favor React function components + hooks; wrap map interactions in context (`useMap`) rather than prop-drilling raw `MapView` references.
- Keep `MapProvider` the single source of truth for map state (`setMapView`, `placeGraphic`, `zoom`). Log warnings instead of throwing when map isn’t ready (matches existing patterns).
- Type imports using `__esri.*` ambient types (ArcGIS supplies them globally); avoid duplicating type definitions.
- Tailwind: extend via `className` utilities; global typography is defined in `index.css`. For design-system components, prefer UDS props over custom markup.
- Environment-sensitive code should guard against `import.meta.env` missing values to keep preview builds working without secrets.
- Vendor assets in `public/assets` are treated as generated—don’t hand-edit. For new static content, prefer `public/` root or React-managed assets.

## Map & ArcGIS specifics

- `MapContainer` creates a bare `EsriMap` + `MapView` and disables zoom snapping. Modify layer setup via context/hook once `mapView` is ready.
- The `LayerSelector` component expects `selectorOptions.options.view` and a valid Discover token; re-use that shape when extending.
- Hooks like `useGraphicManager` (from `@ugrc/utilities`) manage temporary graphics; call `placeGraphic` with a single `Graphic` or array.
- Tree-shaking ArcGIS modules: import from `@arcgis/core/...` (ESM). When adding layers/widgets, always `await layer.when()` before interacting, otherwise the map will warn in dev.

## Firebase & deployment notes

- Firebase Hosting config lives in `firebase.json`; SPA rewrite routes all paths to `index.html`.
- Security headers are pinned here—adjust `firebase.json` if new assets require different cache policies.
- Deploy pipeline is done via GitHub Actions (see `.github/workflows/`) no need to modify the changelog manually.

## Tools & resources

- **Design system docs:** https://ut-dts-agrc-kitchen-sink-prod.web.app/?path=/docs/utah-design-system-src-components-avatar--docs (covers UDS React components used here).
- **ArcGIS API for JavaScript:** https://developers.arcgis.com/javascript/latest/ for MapView/Layers API reference.
- **UGRC utilities:** https://github.com/agrc/kitchen-sink/tree/main/packages/utilities (source for `useGraphicManager`, extents, etc.).
- **Firebase Hosting:** https://firebase.google.com/docs/hosting for deploy reference.
- **Release history:** `CHANGELOG.md` shows cadence and links to GitHub releases.

## Quick troubleshooting

- Missing basemaps? Check `VITE_DISCOVER` and run `pnpm copy:arcgis` (assets or token mismatch).

## Commits

Use conventional commits as outlined here: https://github.com/agrc/release-composite-action/blob/main/README.md
