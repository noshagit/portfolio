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

## RÈGLE IMPÉRATIVE - SYNCHRONISATION i18n (FR/EN)

Ce projet est bilingue. Toute modification, ajout ou suppression de contenu textuel doit IMPÉRATIVEMENT être répercuté et traduit simultanément dans `src/locales/fr.json` et `public/locales/en.json`. Les structures de données doivent rester strictement miroirs. Ne pas attendre de demande explicite.

## Règles strictes de rédaction et typographie

- **Tirets cadratins interdits** : Le tiret cadratin (—) et le demi-cadratin (–) sont FORMELLEMENT BANNIS de tout le projet (fichiers de code, composants, fr.json, en.json). Pour séparer des éléments ou des plages de dates, utiliser exclusivement le tiret court (-), la barre verticale (|), ou reformuler la phrase de manière fluide.
- **Accentuation française** : Appliquer scrupuleusement les accents, y compris sur les majuscules (É, À, È). Ex : "Expériences", "Études", "Équipe".
- **Majuscules en français** : Aucune majuscule injustifiée sur un nom commun en milieu de phrase. Les majuscules sont réservées aux débuts de phrases, noms propres, acronymes et marques. Ex : "Déploiement d'une infrastructure" (pas "Infrastructure").
- **Titres de sections** : Les préfixes `//` sont FORMELLEMENT BANNIS de tous les labels de sections (fr.json, en.json et composants). Les labels sont stockés en minuscules dans les JSONs ; le CSS applique `uppercase tracking-widest font-semibold text-sm` via `SectionLabel`. Conserver les accents sur les majuscules visuelles (ex : "PARCOURS ÉDUCATIF").
- **Scroll restoration** : Chaque transition entre deux pages distinctes doit déclencher `window.scrollTo({ top: 0, behavior: 'instant' })` avant le changement de vue. Géré dans `AppShell.navigate` — ne pas appeler `setCurrentView` directement depuis les pages.
- **Responsive sidebar** : Les éléments de navigation fixes (dot-nav, sommaires) ne doivent jamais chevaucher le texte. `PresentationNav` est `2xl:flex` (seuil 1536px) — ne jamais repasser à `xl:flex` sans vérifier `(viewport - max-w-5xl) / 2 > largeur_nav`. Le scroll cue est `2xl:hidden` pour rester synchronisé.
- **Scroll mobile (slides)** : Sur les pages à navigation par slides (Présentation), intercepter `touchmove` avec `{ passive: false }` et appeler `e.preventDefault()` pour bloquer le scroll natif de la page. Autoriser le scroll uniquement quand le contenu de la slide est en cours de défilement interne (pas à sa limite). Nettoyer tous les listeners dans le `return` du `useEffect`.
- **Alignement justifié** : Tous les blocs de texte descriptifs (paragraphes de section, descriptions, biographies, textes de passion, recommandations, modales) utilisent IMPÉRATIVEMENT la classe Tailwind `text-justify`. L'alignement à gauche est réservé aux labels (`// section`), titres, boutons et éléments courts (< 2 lignes attendues).

## Architecture en composants & auto-vérification

- **Découpage** : Structurer en composants réutilisables et modularisés. Éviter les fichiers uniques trop denses.
- **Auto-vérification** : Après chaque modification, relire le script complet pour vérifier : absence de régressions, typage TypeScript correct, alignement des balises, fluidité des animations.

## Engineering Standards (non-negotiable)

**Design Tokens** — All colors, spacing, and typography are centralized in `src/index.css` as CSS custom properties. Never hardcode hex values or magic numbers in components. Always use semantic Tailwind tokens: `bg-background`, `text-foreground`, `text-accent`, `bg-accent-muted`.

**SRP** — Data fetching and state logic live in hooks or context (`src/hooks/`, `src/context/`). Components render only. No fetch calls or business logic inside JSX files unless they are the dedicated owner (e.g. `LanguageContext.tsx`).

**DRY** — Shared constants live in `src/lib/` (e.g. `motion.ts` exports `EASE`). Never duplicate a constant across files. Shared UI patterns become atoms in `src/components/ui/`.

**Lint gate** — Run `npm run lint` before closing any task. Zero warnings, zero errors is the bar. Inline `oxlint-disable` is allowed only with an explanatory comment.

**Fetch robustness** — Always check `res.ok` before calling `res.json()`. Throw on non-2xx; callers must handle gracefully (fallback to last known good state).

**i18n** — Both FR and EN are fetched at runtime from `public/locales/{lang}.json`; neither is bundled. Experience data per language in `public/locales/{lang}/experiences.json`. Module-level `Map` caches prevent redundant fetches. See synchronisation rule above.

**Performance** — Translatable resources and heavy data sets (like `experiences.json`) must be lazy-loaded per locale. Never preload unused languages. `AppShell` renders nothing until the active locale's fetch resolves (see Splash gate below) — never add a `t`-consuming hook call above that gate. Privilege `transform`/`opacity` for animations; use `React.memo`/`useMemo` for heavy computations or filtered arrays.

## Documentation & Commenting Rules

**No inline or loose comments** — Never scatter `// comments` inside function or component bodies. The only accepted exception is a non-obvious workaround, security constraint, or sentinel value whose intent cannot be expressed through the identifier alone.

**Lightweight docstring for small units** — Simple components, hooks, helpers, or utilities under ~15 lines get a single-line JSDoc block stating the primary purpose. No `@param`/`@returns` needed unless the signature is ambiguous. Example: `/** Formats a detailed_date tuple into a localized display string. */`

**Heavy docstring for complex units** — Large components, core logic handlers, state machines, or filtering/pagination engines get a full multi-line JSDoc block with:
- A clear description of the component's or function's role.
- `@param` tags with descriptive explanations for each argument/prop.
- `@returns` tag detailing the output structure or rendered element.
- `@throws` or side-effect notes where applicable (e.g. scroll lock, event listeners registered on `window`).

## Architecture

SPA with URL-based routing, hand-rolled (no router library — `src/lib/routes.ts` is a ~20-line bidirectional `View <-> path` mapping, deliberately not a dependency given the page count). `AppShell` (inside `App.tsx`) holds `currentView: View` as the render source of truth and renders the active page via a `PAGES` map; the URL is kept in sync with it, not the other way around. `AnimatePresence` from framer-motion wraps the active `<Page>` for enter/exit transitions.

**Routing** (`src/lib/routes.ts`) — `viewToPath(view, lang)` / `parseLocation(pathname)` map each `View` to a path segment (`landing` → `''`, others → their id) with an `/en` prefix for English and no prefix for French (`/`, `/en`, `/experiences`, `/en/experiences`, ...). `AppShell` seeds `currentView` from `parseLocation(window.location.pathname)` on mount, calls `history.pushState` inside `navigate()` for real page changes, and `history.replaceState` from a `useEffect([currentView, lang])` to normalize the URL when only the language changes (via `LangToggle`) or to clean up a legacy `?lang=` URL — never adds a redundant history entry for those. A `popstate` listener handles browser back/forward. **Any new `View` must be added to `VIEW_SLUGS` in `routes.ts` AND to `public/sitemap.xml`** (same spirit as the recommendation-letters rule below — nothing generates the sitemap automatically). `public/_redirects` (`/* /index.html 200`) makes the SPA fallback work on Cloudflare Pages so a direct load of `/en/experiences` doesn't 404.

**Data flow**: `onNavigate(view: View)` is passed down as a prop from `AppShell` to every page and to `Header`; its signature never changed by routing — pages still just call it with a `View`, `AppShell` owns the URL side effects. Pages never navigate themselves directly.

**Per-page metadata** (`src/hooks/useDocumentMeta.ts`) — called unconditionally from `AppShell` (before its `loading` early-return, so the `t.meta` read happens **inside** the effect, guarded by `loading` — never at the hook's top level, since `t` is an unsafe cast until translations resolve, see i18n below). On `[currentView, lang]` change it updates `document.title`, the `#meta-description`/`#canonical-link`/OG/Twitter tags, and the three `#hreflang-*` links — all pre-declared with stable `id`s in `index.html`, targeted via `document.getElementById`. Per-view copy lives in `t.meta.{view}.{title,description}` (`public/locales/{lang}.json`) — add a new key there for every new `View`. **Known limitation**: this only reaches crawlers that execute JS (Googlebot does). Social-share bots (LinkedIn, Twitter, Slack unfurl) never run JS, so they always see `index.html`'s static FR landing tags regardless of which URL was shared — fixing that needs prerendering or a Cloudflare Pages Function, not implemented here.

**Accessibility baseline** — `SkipLink` (`src/components/ui/SkipLink.tsx`, rendered first inside `AppShell`'s returned JSX, after the `loading` gate) jumps to `<main id="main-content">`. `AppShell` moves focus to `<main>` (`tabIndex={-1}` + `.focus({ preventScroll: true })`) on every `currentView` change except the very first render, so SPA navigations land focus somewhere instead of leaving it stranded. `Header`'s nav buttons set `aria-current="page"` on both the desktop and mobile variants — keep both in sync if you touch one.

**Theming**: `ThemeContext` applies/removes the `.dark` class on `<html>` and persists to `localStorage`. Consume via `useTheme()` from `src/hooks/useTheme.ts`. During toggle, `ThemeContext` briefly adds `.theme-transition` to `<html>` so CSS transitions fire; it removes it after 500ms so hover animations stay snappy the rest of the time. CSS variables (`--background`, `--foreground`, `--accent`, `--accent-muted`) are declared in `index.css` for both light/dark modes and exposed as Tailwind tokens via `@theme`. Always use semantic tokens (`bg-background`, `text-foreground`, `text-accent`) — never hardcode colors.

**Pages** (`src/pages/`): `Landing`, `Presentation`, `Experiences`, `Contact`, `Privacy`, `legal/LegalNotice` — each accepts `{ onNavigate }` prop and wraps its root element in a `<motion.div>` with the standard fade+slide transition (`opacity 0→1, y 24→0`). All pages except `Landing` are `React.lazy()`-loaded; `SplashGate` prefetches all lazy chunks during the splash animation so every route is ready before the user can interact. `Footer` is rendered for all views except `presentation`.

**Content data** — experience data per language lives in `public/locales/{lang}/experiences.json` (both fetched at runtime, none bundled). The `Experience` interface and `SortDir` type live in `src/types/experience.ts`. `src/types/index.ts` holds only `View`, `Theme`, and `NavItem`.

**i18n** — `LanguageContext` + `useLang()` hook. `Translations = typeof FR`, where `FR` is a **type-only** import of `public/locales/fr.json` (`import type FR from '../../public/locales/fr.json'`) — erased at build time, so it costs nothing at runtime, but keeps the FR JSON as the single compile-time source of truth that EN must mirror exactly. `LanguageContext`'s exposed `t: Translations` is asserted non-null internally; that assertion is only sound because `AppShell` (`src/App.tsx`) renders `null` while `loading` is true, so no `t`-consumer can mount before the fetch resolves. Experience translations in `public/locales/{lang}/experiences.json`, fetched by `Experiences.tsx` via `useEffect([lang])` — that page keeps its own `loadingExp` state since experience data is a separate fetch from `t`. `EASE` animation constant lives in `src/lib/motion.ts` — import from there, never redeclare.

**Linter**: oxlint with react + typescript + oxc plugins. `react/rules-of-hooks` is an error; `react/only-export-components` is a warning (constant exports allowed). No ESLint.

**Tailwind v4** — config is in `index.css` via `@theme` / `@custom-variant`, not `tailwind.config.*`. One custom utility exists: `shadow-accent` (accent-colored drop shadow via `@utility`). Fonts: `font-sans` → Inter, `font-mono` → JetBrains Mono.

**Animations**: page transitions use `AnimatePresence mode="wait"`; card grids use `mode="popLayout"` with `motion.div layout` for smooth reordering. Modal pattern in `Experiences.tsx`: backdrop + centered shell with `pointer-events-none` to let backdrop clicks fall through, inner panel with `pointer-events-auto` and `stopPropagation`.

**Splash gate** — `App` renders a `SplashGate` (reads `loading` from `LanguageContext`) alongside `AppShell`. `SplashScreen` dismisses only when both its progress bar animation completes AND `loading` is false. `AppShell` itself also reads `loading` and renders `null` until it flips false — since neither FR nor EN is bundled, this is what keeps every `t`-consumer downstream (Header, Footer, all pages) from ever rendering with unresolved translations. Never bypass either gate for perceived-performance reasons; together they mask the locale fetch latency for both languages.

**Experience image gallery** — `src/pages/experiences/imageMap.ts` uses `import.meta.glob` to discover all images under `src/assets/experiences/{id}/` at build time. Drop image files into that directory named by experience `id` to activate a gallery in the modal. No code change needed.

**Presentation page** — unlike all other pages, `Presentation.tsx` is a fullscreen paged slider (not a scroll page). It manages 6 sections via `activeIdx` state and custom wheel/keyboard/touch handlers registered on `window`. A 650 ms cooldown debounce prevents rapid flipping. For scrollable sections, the edge-hold logic requires the user to hold at the scroll boundary for `EDGE_HOLD_MS` (700 ms) before the slide advances. `PresentationNav` is a fixed left-rail dot nav that only renders at `xl:` and above. Never add `overflow-y-scroll` to the page root — section overflow is handled per-slide via `sectionRef`.

**Recommendation letters** — PDFs live in `public/ldr/`. Each locale JSON entry under `presentation.recommendations.items[].pdf` must point to the correct path. Adding a new recommendation requires: dropping the PDF in `public/ldr/`, then adding the entry to both `public/locales/fr.json` and `public/locales/en.json`.

**Lang resolution order** — the URL path is the sole source of truth for which language renders (`/en/*` → EN, everything else → FR); `?lang=` is only a legacy fallback that `AppShell` normalizes into a path on mount. Deliberately **not** based on `localStorage`/`navigator.language` — a canonical URL must always render the same content to every visitor/crawler/cache, which path-based hreflang requires. `LangToggle` is the only way to actually change language; it pushes the new URL once the fetch resolves.

**Security headers** — `public/_headers` (Cloudflare Pages format) sets a strict CSP with a hardcoded `sha256-...` hash allowlisting the single inline bootstrap script emitted by the build. If `index.html`'s inline script content ever changes (byte-for-byte, including whitespace), this hash must be regenerated or the CSP silently blocks the page in production. **Compute it from `dist/index.html` after `npm run build`, not from the source `index.html`** — Vite reformats the inline script's whitespace during build, so hashing the source produces a different (wrong) value: `node -e "require('fs').writeFileSync('/tmp/s.js', require('fs').readFileSync('dist/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1])" && openssl dgst -sha256 -binary /tmp/s.js | openssl base64`.
