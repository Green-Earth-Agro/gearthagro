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
