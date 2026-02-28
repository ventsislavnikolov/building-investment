# Project Progress — Building Investment Platform

**Last updated:** 2026-02-28
**Status:** Planning complete. Ready to implement.

---

## What Was Done

### 1. Full brainstorm + design session
- Decided: full rewrite from Next.js 15 → TanStack Start
- Chose Keyturn (Behance #169315941) as design reference
- EN = default (no URL prefix), BG = `/bg/` prefix
- Font: Plus Jakarta Sans (free replacement for Cera Pro)
- Colors: `#1B59E8` blue, `#EEF2F6` bg, `#151515` text, `#CEE8FB` light blue, `#ACB3BA` muted

### 2. Documents created
- `docs/plans/2026-02-28-full-rewrite-design.md` — full design spec (colors, typography, app shell, all page layouts, 35 routes)
- `docs/plans/2026-02-28-full-rewrite-implementation.md` — full TDD implementation plan (9 milestones, all tasks, exact file paths, code snippets)
- `design-images/SCREENS.md` — maps every cryptic image filename to its screen + route + design details

### 3. Plan additions (second session)
Added to both design doc and implementation plan:
- **MCP servers table** — Supabase, Vercel, Chrome DevTools, shadcn, context7, Linear, Stripe, Playwright
- **Sentry** — `@sentry/tanstackstart-react`, error boundaries, source maps, Task 1.10 in M1
- **Responsive design** — mobile-first, 375/768/1440px breakpoints, sidebar drawer on mobile, Playwright 4-viewport config
- **Design image refs** — every UI task now has `> Design refs: filename.png` pointing to the right Keyturn screen
- **Playwright visual check pattern** — screenshot strategy to compare against design-images/

### 4. Codebase cleanup
- Deleted all old Next.js code (src/, tests/, public/, all config files)
- Only `design-images/` and `docs/` remain as visible folders
- All 14 design images catalogued and committed

---

## Current State of the Repo

```
building-investment/
├── .git/
├── .github/           (CI workflows)
├── .gitignore
├── .claude/           (Claude memory)
├── design-images/
│   ├── SCREENS.md     ← screen index with design details
│   └── *.png          (14 Keyturn reference screenshots)
└── docs/
    ├── architecture.md
    ├── data-model.md
    ├── database-schema.sql
    ├── plans/
    │   ├── 2026-02-28-full-rewrite-design.md
    │   └── 2026-02-28-full-rewrite-implementation.md
    └── progress.md    ← this file
```

---

## What Needs to Happen Next (in order)

### Step 1 — Set up Linear MCP (do this before starting)
```bash
claude mcp add linear -- npx -y @linear/mcp-server
```
Then restart Claude Code.

### Step 2 — Create Linear project structure
Use Linear MCP to create:
- 9 Milestones: M1 Foundation → M9 Polish + Launch
- Features and tasks per milestone (see implementation plan)

### Step 3 — Begin implementation
Follow `docs/plans/2026-02-28-full-rewrite-implementation.md` task by task.

Use skill: `superpowers:executing-plans`

---

## Implementation Plan Summary (9 Milestones)

### M1 · Foundation (do first, sequential)
- **1.1** Delete old code, scaffold TanStack Start (`pnpm create tanstack-app@latest`)
- **1.2** Env validation (`app/env.ts` with Zod)
- **1.3** Supabase clients (browser + server + admin)
- **1.4** i18n — custom `t(locale, key)` helper, `messages/en.json` + `messages/bg.json`
- **1.5** Routing helpers (`getLocaleFromParams`, `localePath`)
- **1.6** Auth server functions (login, register, logout, getSession)
- **1.7** Route guards (`requireAuth`, `requireAdmin` in `beforeLoad`)
- **1.8** shadcn/ui setup + base components + Keyturn design tokens
- **1.9** App shell layout (sidebar, top bar, collapsible nav) — use `frontend-design` skill
- **1.10** Biome + Husky + commitlint + Jest + Playwright config
- **1.11** Sentry setup + error boundaries

### M2 · Marketing Site (parallel after M1)
- **2.1** Marketing layout (nav + footer)
- **2.2** Landing page (10 sections, see `35293a...png`)
- **2.3** How it works
- **2.4** About

### M3 · Auth Pages
- **3.1** Login page
- **3.2** Register page
- **3.3** Forgot password

### M4 · Public Project Pages
- **4.1** Project server functions (list, detail, search/filter)
- **4.2** Project catalog (map, filter panel, card grid — see `5dc528...png`)
- **4.3** Project detail page (see `faf442...png` + `051a85...png`)

### M5 · Investment Flow + Stripe
- **5.1** Stripe server functions (checkout session, webhook)
- **5.2** Checkout page (see `67cbfb...png` — payment + billing summary)
- **5.3** Success page

### M6 · Investor Dashboard
- **6.1** Dashboard layout + shell
- **6.2** Dashboard overview (KPI cards)
- **6.3–6.13** All 11 dashboard pages (investments, portfolio, wallet, transactions, distributions, favorites, progress, documents, notifications, KYC, settings)
- Design refs per page in implementation plan

### M7 · Admin Panel
- **7.1** Admin shell (extended sidebar)
- **7.2–7.13** All 12 admin pages (dashboard, projects CRUD, investors, cap table, budget, contractors, documents, audit, metrics)

### M8 · KYC + Emails + Realtime
- **8.1** Sumsub KYC (token generation + WebSDK)
- **8.2** Resend email templates (welcome, investment confirmed, distribution)
- **8.3** Supabase Realtime (funding progress, wallet balance hooks)

### M9 · Polish + Launch
- **9.1** SEO meta tags + sitemap
- **9.2** Full E2E test suite (4 viewports via Playwright MCP)
- **9.3** Performance audit (Lighthouse 90+)
- **9.4** Sentry production verification
- **9.5** Security audit
- **9.6** Production deploy via Vercel MCP

---

## Key Technical Decisions

| Decision | Choice |
|----------|--------|
| Framework | TanStack Start (Vinxi + Nitro) |
| Router | TanStack Router, file-based, `app/routes/` |
| i18n | Custom `t(locale, key)` — no library. EN = no prefix, BG = `/bg/` |
| Locale segment | Optional `($locale)` in route tree, `beforeLoad` normalizes it |
| Auth | Supabase Auth, JWT in cookies, server client via Nitro H3 |
| Mutations | `createServerFn` from TanStack Start |
| Data fetching | `loader` in route definitions + TanStack Query for client cache |
| Global state | TanStack Store (locale, theme, UI state) |
| Forms | TanStack Form + Zod |
| DB | Supabase PostgreSQL, schema in `docs/database-schema.sql` — UNCHANGED |
| Payments | Stripe Connect, webhook via `createAPIFileRoute` |
| Env | Zod schema in `app/env.ts`, `import.meta.env.*` |
| Monitoring | Sentry `@sentry/tanstackstart-react` |
| Font | Plus Jakarta Sans from Google Fonts |
| Breakpoints | 375px mobile / 768px tablet / 1440px desktop |

---

## MCP Servers to Use

| MCP | When |
|-----|------|
| Supabase | DB migrations, queries, RLS policies |
| Vercel | Deploy, logs, env vars |
| Chrome DevTools | Console errors, network, performance |
| shadcn | Add components, browse examples |
| context7 | Latest API docs (TanStack, Supabase, Stripe) |
| Linear | Create/update/close milestones, features, tasks |
| Stripe | Products, webhooks, payment intents |
| Playwright | E2E tests, responsive checks, screenshots |

---

## Skills to Use

| When | Skill |
|------|-------|
| Every feature | `tdd` (Matt Pocock) — red-green-refactor |
| Any UI page | `frontend-design` |
| Before claiming done | `superpowers:verification-before-completion` |
| Bug appears | `superpowers:systematic-debugging` |
| Phase complete | `superpowers:requesting-code-review` |
| Commits | `create-commit` |
| Build broken | `stabilize` |
| Executing plan | `superpowers:executing-plans` |

---

## TDD Rule (mandatory)
Every task: write failing test → run to verify red → implement minimal code → run to verify green → commit → update Linear.
Never write implementation before the test is red.

## Responsive Rule (mandatory)
Every UI task: verify at 375px, 768px, 1440px before committing. Use Chrome DevTools MCP or Playwright MCP.

---

## Git Log (latest commits)
```
0321214 chore(cleanup): delete old Next.js code, add design-images/SCREENS.md, update plan with design refs
e19cc10 docs(plans): add MCP tools, Sentry, and responsive design requirements
29d071f ✨ feat(routing): remove /en prefix for default locale  (old Next.js code, now deleted)
```

---

## Resuming in a New Session

Tell Claude Code:
> "Read docs/progress.md and continue the implementation. We are at the start of M1. Set up Linear MCP first, then begin Task 1.1 from docs/plans/2026-02-28-full-rewrite-implementation.md."

Or if Linear is already set up:
> "Read docs/progress.md. Linear is set up. Create all milestones and tasks in Linear, then begin Task 1.1."
