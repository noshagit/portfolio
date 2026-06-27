# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Behavior
- Mode: CAVEMAN. Ultra-minimalist syntax. No pleasantries.
- Tone: Cybersecurity expert, strict and direct.

## Custom Commands
- /map : Execute `tree -I 'node_modules|dist|.git'` to get the exact repository mapping instantly.

## Commands

```bash
npm run dev       # start dev server (Vite HMR)
npm run build     # tsc -b && vite build
npm run lint      # oxlint (no tests exist)
npm run preview   # preview production build
```

## Engineering Standards (non-negotiable)

**Design Tokens** — All colors, spacing, and typography are centralized in `src/index.css` as CSS custom properties. Never hardcode hex values or magic numbers in components. Always use semantic Tailwind tokens: `bg-background`, `text-foreground`, `text-accent`, `bg-accent-muted`.

**SRP** — Data fetching and state logic live in hooks or context (`src/hooks/`, `src/context/`). Components render only. No fetch calls or business logic inside JSX files unless they are the dedicated owner (e.g. `LanguageContext.tsx`).

**DRY** — Shared constants live in `src/lib/` (e.g. `motion.ts` exports `EASE`). Never duplicate a constant across files. Shared UI patterns become atoms in `src/components/ui/`.

**Lint gate** — Run `npm run lint` before closing any task. Zero warnings, zero errors is the bar. Inline `oxlint-disable` is allowed only with an explanatory comment.

**Fetch robustness** — Always check `res.ok` before calling `res.json()`. Throw on non-2xx; callers must handle gracefully (fallback to last known good state).

**i18n** — FR is bundled (`src/locales/fr.json`). EN is lazy-fetched (`public/locales/en.json`). Experience data per language lives in `public/locales/{lang}/experiences.json`. Module-level `Map` cache prevents redundant fetches. Locale keys must stay in sync across both JSON files.

### 4. Performance & Resource Optimization
- **Asset & Data Loading**: Always optimize data consumption. Translatable resources and heavy data sets (like `experiences.json`) must be dynamically or lazy-loaded based on the active locale. Never preload unused languages or heavy assets that waste network bandwidth.
- **Rendering Performance**: Keep components lightweight. Strive for a locked 60 FPS experience by preventing unnecessary layout reflows. Always privilege hardware-accelerated CSS properties (`transform`, `opacity`) for animations and use `React.memo` or `useMemo` to cache heavy computations or filtered arrays.

## Architecture

SPA with no router — navigation is pure React state. `App.tsx` holds `currentView: View` and renders the active page via a `PAGES` map. `AnimatePresence` from framer-motion wraps the active `<Page>` for enter/exit transitions.

**Data flow**: `onNavigate(view: View)` is passed down as a prop from `AppShell` to every page and to `Header`. Pages never navigate themselves directly.

**Theming**: `ThemeContext` applies/removes the `.dark` class on `<html>` and persists to `localStorage`. Consume via `useTheme()` from `src/hooks/useTheme.ts`. During toggle, `ThemeContext` briefly adds `.theme-transition` to `<html>` so CSS transitions fire; it removes it after 500ms so hover animations stay snappy the rest of the time. CSS variables (`--background`, `--foreground`, `--accent`, `--accent-muted`) are declared in `index.css` for both light/dark modes and exposed as Tailwind tokens via `@theme`. Always use semantic tokens (`bg-background`, `text-foreground`, `text-accent`) — never hardcode colors.

**Pages** (`src/pages/`): `Landing`, `Presentation`, `Experiences`, `Contact` — each accepts `{ onNavigate }` prop and wraps its root element in a `<motion.div>` with the standard fade+slide transition (`opacity 0→1, y 24→0`).

**Content data** lives in `src/data/` (FR experiences JSON, bundled). The `Experience` interface and `SortDir` type live in `src/types/experience.ts`. `src/types/index.ts` holds only `View`, `Theme`, and `NavItem`.

**i18n** — `LanguageContext` + `useLang()` hook. FR bundled, EN lazy-fetched. Experience translations in `public/locales/en/experiences.json` (separate file, fetched by `Experiences.tsx` via `useEffect([lang])`). `EASE` animation constant lives in `src/lib/motion.ts` — import from there, never redeclare.

**Linter**: oxlint with react + typescript + oxc plugins. `react/rules-of-hooks` is an error; `react/only-export-components` is a warning (constant exports allowed). No ESLint.

**Tailwind v4** — config is in `index.css` via `@theme` / `@custom-variant`, not `tailwind.config.*`. One custom utility exists: `shadow-accent` (accent-colored drop shadow via `@utility`). Fonts: `font-sans` → Inter, `font-mono` → JetBrains Mono.

**Animations**: page transitions use `AnimatePresence mode="wait"`; card grids use `mode="popLayout"` with `motion.div layout` for smooth reordering. Modal pattern in `Experiences.tsx`: backdrop + centered shell with `pointer-events-none` to let backdrop clicks fall through, inner panel with `pointer-events-auto` and `stopPropagation`.
