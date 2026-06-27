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

## Architecture

SPA with no router — navigation is pure React state. `App.tsx` holds `currentView: View` and renders the active page via a `PAGES` map. `AnimatePresence` from framer-motion wraps the active `<Page>` for enter/exit transitions.

**Data flow**: `onNavigate(view: View)` is passed down as a prop from `AppShell` to every page and to `Header`. Pages never navigate themselves directly.

**Theming**: `ThemeContext` applies/removes the `.dark` class on `<html>` and persists to `localStorage`. Consume via `useTheme()` from `src/hooks/useTheme.ts`. During toggle, `ThemeContext` briefly adds `.theme-transition` to `<html>` so CSS transitions fire; it removes it after 500ms so hover animations stay snappy the rest of the time. CSS variables (`--background`, `--foreground`, `--accent`, `--accent-muted`) are declared in `index.css` for both light/dark modes and exposed as Tailwind tokens via `@theme`. Always use semantic tokens (`bg-background`, `text-foreground`, `text-accent`) — never hardcode colors.

**Pages** (`src/pages/`): `Landing`, `Presentation`, `Experiences`, `Contact` — each accepts `{ onNavigate }` prop and wraps its root element in a `<motion.div>` with the standard fade+slide transition (`opacity 0→1, y 24→0`).

**Content data** lives in `src/data/` as JSON (e.g. `experiences.json`). The `Experience` interface is defined inline in `Experiences.tsx`, not in `src/types/index.ts` — `types/index.ts` only holds `View`, `Theme`, and `NavItem`.

**Linter**: oxlint with react + typescript + oxc plugins. `react/rules-of-hooks` is an error; `react/only-export-components` is a warning (constant exports allowed). No ESLint.

**Tailwind v4** — config is in `index.css` via `@theme` / `@custom-variant`, not `tailwind.config.*`. One custom utility exists: `shadow-accent` (accent-colored drop shadow via `@utility`). Fonts: `font-sans` → Inter, `font-mono` → JetBrains Mono.

**Animations**: page transitions use `AnimatePresence mode="wait"`; card grids use `mode="popLayout"` with `motion.div layout` for smooth reordering. Modal pattern in `Experiences.tsx`: backdrop + centered shell with `pointer-events-none` to let backdrop clicks fall through, inner panel with `pointer-events-auto` and `stopPropagation`.
