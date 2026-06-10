# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

SlideSurf frontend — a React 19 + Vite SPA for AI-generating and editing presentations. The API server lives in `../slidesurf-backend`. Default UI/content language is Russian (`ru`). The `@/*` path alias maps to `src/*`.

## Commands
```bash
npm run dev        # vite dev server (proxies /api → VITE_API_BASE_URL, default http://localhost:3001)
npm run build      # tsc -b && vite build  (type-check is part of the build)
npm run preview    # serve the production build
npx playwright test                              # e2e tests (config: playwright.config.ts, testDir ./e2e)
npx playwright test e2e/foo.spec.ts -g "name"    # run a single spec / a test by title
```
There is **no lint script and no unit-test runner** — type-checking via `tsc` (run `npx tsc -b` or `npm run build`) is the safety net. Playwright runs `headless: false` against `http://localhost:5173` and auto-starts `npm run dev`. See `.env.example` for `VITE_*` vars.

## Architecture
- **Routing** (`src/router.tsx`): `react-router-dom` v7, all pages lazy-loaded. `RootLayout` → optional `ProtectedRoute` → `SidebarLayout`. The editor (`/editor`, `/editor/:id`), `/present/:id`, and `/export/:id` render **outside** the sidebar. Pages are in `src/pages/`.
- **State** is split two ways:
  - **Server state** → TanStack Query (configured in `src/components/providers.tsx`: `staleTime: 0`, no refetch-on-focus). All HTTP goes through `src/api/*`, which use `apiRequest` / `apiStream` / `apiFetch` from `src/api/client.ts` — these send cookies **and** an `Authorization: Bearer` header from `localStorage["better-auth-token"]`.
  - **Editor / client state** → Jotai atoms (e.g. `presentationAtom` in `src/lib/hooks/use-presentation.ts`). Most app behavior is encapsulated in `src/lib/hooks/*` (`use-presentation-generation`, `use-slides-generation`, `use-pptx-export`, `use-theme`, `use-image-generation`, `use-subscription-dialog`, …) — prefer extending a hook over inlining logic in components.
- **Auth**: `better-auth/react` client (`src/lib/auth-client.ts`) stores the token in `localStorage` and attaches it to every request; supports generic OAuth (Google, Yandex).

### The slide editor is the heart of the app
- A **`Slide`** (`src/types.ts`) is `{ content (HTML/markdown string), layout (SlideLayout), verticalAlign, colorAccent, backgroundImageUrl, ... }`. A **`Presentation`** is `{ slides, themeId, ... }`.
- The editor is **TipTap / ProseMirror** with many **custom nodes** in `src/lib/nodes/` — each node is a `*.ts` schema definition + a `*-view.tsx` React NodeView: `columns`, `card`, `chart`, `table`, `smart-layout`, `bento-grid`, `timeline`, `flowchart`, `icon`, `image`, `feature(s)`, etc. To add an editor element, add both files and register the node with the editor.
- `SmartLayout` variants (statistics, big-numbers, rating-stars, arrows, pyramid/funnel, quotes) are dispatched through **`src/components/layout-factory.tsx`**.
- `SlidesTemplates` (enum in `src/types.ts`) enumerates predefined slide layouts; these mirror the backend's slide templates and prompt output.

### UI & theming
- Tailwind CSS v3 + Radix UI primitives / shadcn-style components in `src/components/ui/`. AI-chat UI building blocks live in `src/components/ai-elements/`.
- Light/dark via `next-themes`. Presentation **Themes** (colors/fonts/per-layout overrides) are a first-class domain — see `Theme`/`ThemeColors` in `src/types.ts` and the editor in `src/components/theme-editor/`.
- **i18n**: `react-i18next` with browser language detection; locale files under `src/lib/locales/`. Default language is Russian — author new strings in `ru` and add keys to all locales.

## Cross-cutting
- Frontend `src/types.ts` is maintained in parallel with the backend's `../slidesurf-backend/src/shared/` types + Zod schemas. When you change a generation request/response shape, update both sides.
- AI features are subscription-gated: the backend enforces limits, and the UI mirrors them in `src/lib/subscription-limits.ts` / `subscription-utils.ts` for gating dialogs and disabled states.
