# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check then build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test runner is configured yet.

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** — loaded via `@tailwindcss/vite` plugin (not PostCSS). Import in CSS with `@import "tailwindcss"`, extend theme with `@theme {}`.
- **`@tailwindcss/typography`** — loaded via `@plugin "@tailwindcss/typography"` in CSS.

## Design token system

All design tokens live in `src/index.css` under `@theme {}` with the `agro-` prefix. Utility classes like `bg-agro-primary`, `text-agro-text-muted`, etc. are defined in `@layer base` and map to CSS custom properties.

Color scale convention: each palette has `a0` (darkest/most saturated) through `a50` (lightest). Example: `--color-agro-primary-a0` through `--color-agro-primary-a50`.

Semantic roles: `primary` (olive green brand), `secondary` (slate neutral), `accent` (red, used sparingly), `surface` (light/dark backgrounds), `text-*` tokens, plus `success`/`warning`/`danger`/`info` state colors.

Dark mode is automatic via `@media (prefers-color-scheme: dark)` — it overrides the `:root` CSS variables, so no class toggling is needed. Never hard-code color values; always use the `agro-*` tokens.

## Two apps, one repo

This repo builds **two separate Vite entries** into one Vercel deployment:

- `index.html` → `src/main.tsx` → `src/App.tsx`: the **public marketing site** (register: `brand`, per PRODUCT.md). Single-page, hash-routed (`#/privacy`). No data layer.
- `console.html` → `src/admin/main.tsx`: the **staff admin console** (register: `product`). A protected SPA backed by Supabase.

The split is in `vite.config.ts` (`build.rollupOptions.input`). It keeps the admin's Supabase/router code out of the marketing bundle — a public visitor never downloads it. The two share only `src/index.css` (the `agro-*` tokens) and the logo asset; do **not** share UI components between them (marketing is brand-register, the console is data-dense product-register).

### Staff console (`src/admin/`)

- **Routing**: React Router v7 (`createBrowserRouter`) with `basename = ADMIN_BASENAME` from `src/admin/lib/config.ts`. The basename is an **obscure slug** (`/gea-ops-0499ae`). This is "secret from the public" only — it lives in the repo. It is **not** a security boundary.
- **Real security** is Supabase: email/password auth, RLS, and the role-gated RPCs (shared with the mobile app). The slug + `noindex` + `robots.txt` are just noise reduction.
- **Deploy wiring**: `vercel.json` rewrites `/gea-ops-0499ae/*` → `/console.html` (SPA fallback). `vite.config.ts` has a dev-only middleware (`adminDevAlias`) that does the same locally, so `npm run dev` serves the console at the slug too. If you change the slug, update it in **three** places: `vercel.json`, `src/admin/lib/config.ts`, `vite.config.ts` (and `public/robots.txt`).
- **Auth model**: `AuthProvider` resolves a Supabase session, then reads the caller's own active `user_roles` row (self-read RLS, same query as the mobile `RoleGuard`). `RequireStaff` gates routes: `loading` → spinner, `signedOut` → `/login`, signed-in-but-not-staff → `Unauthorized`. The role/permission matrix in `src/admin/types/auth.ts` is kept in sync with the mobile app's `src/types/auth.ts` and only drives what the UI offers.
- **Env**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `.env.example`). Same Supabase project as the mobile app. The marketing build ignores them.
- **Selected / active state styling (convention)**: a selected control, an active filter chip, the active sidebar item, the active tab, uses the tonal surface highlight **`bg-agro-surface-a20 text-agro-text-primary`** (a faint sage tint), *not* the solid green `bg-agro-primary-a0` fill. Crop Green (`primary`) is reserved for **primary actions** (Save/Confirm/New buttons) and **confirmed/positive states** (success pills) — the Rarity Rule. Don't use the green fill just to indicate "selected".
