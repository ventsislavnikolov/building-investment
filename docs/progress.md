# Project Progress — Building Investment Platform

**Last updated:** 2026-03-01
**Status:** M1–M9 fully complete. Production live.

---

## What Was Done

### Full Implementation (M1–M9 complete)

All 9 milestones implemented via TDD. 73 unit tests passing. Build green. Production deployed and healthy.

**Key milestones:**
- **M1** Foundation: TanStack Start scaffold, env, Supabase clients, i18n, auth, shadcn/ui, app shell, Biome/Husky/Jest/Playwright, Sentry
- **M2** Marketing site: landing page (Keyturn-inspired), how it works, about
- **M3** Auth pages: login, register, forgot password
- **M4** Public project pages: catalog, detail, search/filter
- **M5** Investment flow + Stripe: checkout session, webhook, success page
- **M6** Investor dashboard: 13 pages (overview, investments, portfolio, wallet, transactions, distributions, favorites, progress, documents, notifications, KYC, settings, statements)
- **M7** Admin panel: 8 pages (dashboard, projects CRUD, investors, investments, budget, documents, audit, metrics)
- **M8** KYC + Emails + Realtime: Sumsub WebSDK, Resend email templates, Supabase Realtime hooks
- **M9** Polish + Launch: SEO meta + sitemap, E2E tests, security audit, production deploy

### Fixes applied this session
- `full_name` → `first_name` + `last_name` across 10+ files (schema never had `full_name`)
- `NEXT_PUBLIC_APP_URL` → `APP_URL` in `src/server/investments.ts` (Next.js leftover)
- `Stripe.CheckoutSession` → `Stripe.Checkout.Session` (wrong type)
- `SENTRY_DSN` removed from server env schema (Sentry is client-only, uses `VITE_SENTRY_DSN`)
- Created `/api/webhooks/sumsub` route (`handleSumsubWebhook` was never wired up)
- Added E2E tests: `dashboard.spec.ts`, `admin.spec.ts`, expanded `responsive.spec.ts`
- Seeded 4 projects into Supabase: `sofia-flip-lozenets`, `plovdiv-buy-to-rent`, `varna-dev-sea-view`, `sofia-land-boyana` (+ milestones for first two) — fixes empty `/projects` page
- Rewrote `projects.spec.ts`: 17 Playwright tests (catalog, detail, navigation flow, cross-page smoke)
- Fixed `getDashboardSummary` to throw `Error("Unauthenticated")` instead of a redirect object (redirect is handled by layout `beforeLoad`)

---

## Current State

```
building-investment/
├── src/
│   ├── routes/           (TanStack Router file-based, 35+ routes)
│   │   ├── api/webhooks/ (stripe.ts + sumsub.ts)
│   │   ├── ($locale)/    (marketing, auth, dashboard, admin, projects)
│   │   └── __root.tsx
│   ├── components/       (shadcn/ui + custom components)
│   ├── server/           (createServerFn handlers)
│   ├── lib/              (supabase, auth, routing helpers)
│   └── env.ts            (Zod env validation)
├── tests/
│   ├── unit/             (73 tests, all passing)
│   └── e2e/              (Playwright: landing, auth, invest-flow, responsive, sitemap, dashboard, admin, projects)
├── docs/
│   ├── plans/            (design doc + implementation plan)
│   ├── database-schema.sql
│   └── progress.md       ← this file
└── design-images/        (14 Keyturn reference screenshots)
```

**Production:** `https://building-investment.vercel.app` — healthy, all routes 200.

---

## Manual Production Steps Still Needed

These require dashboard access (no MCP tools available for them):

1. **Stripe webhook** → [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
   - URL: `https://building-investment.vercel.app/api/webhooks/stripe`
   - Event: `checkout.session.completed`
   - Copy signing secret → Vercel env var `STRIPE_WEBHOOK_SECRET`

2. **Sumsub webhook** → Sumsub dashboard → Webhooks
   - URL: `https://building-investment.vercel.app/api/webhooks/sumsub`

3. **Sentry** → Vercel project settings → Environment Variables
   - Ensure `VITE_SENTRY_DSN` is set (not `SENTRY_DSN`)

---

## Key Technical Decisions

| Decision | Choice |
|----------|--------|
| Framework | TanStack Start (Vinxi + Nitro) |
| Router | TanStack Router, file-based, `src/routes/` |
| i18n | Custom `t(locale, key)` — no library. EN = no prefix, BG = `/bg/` |
| Locale segment | Optional `($locale)` in route tree, `beforeLoad` normalizes it |
| Auth | Supabase Auth, JWT in cookies, server client via Nitro H3 |
| Mutations | `createServerFn` from TanStack Start |
| Data fetching | `loader` in route definitions + TanStack Query for client cache |
| Global state | TanStack Store (locale, theme, UI state) |
| Forms | TanStack Form + Zod |
| DB | Supabase PostgreSQL, schema in `docs/database-schema.sql` — UNCHANGED |
| Payments | Stripe Connect, webhook via `createAPIFileRoute` |
| Env | Zod schema in `src/env.ts`, `import.meta.env.*` (client: `VITE_` prefix) |
| Monitoring | Sentry via `VITE_SENTRY_DSN` (client-only) |
| Font | Plus Jakarta Sans from Google Fonts |
| Breakpoints | 375px mobile / 768px tablet / 1440px desktop |

---

## Critical Build Pattern (TanStack Start)

- NEVER import `~/lib/supabase/server` directly in `beforeLoad` or component — blocked in client bundle
- ALL supabase server client usage MUST be inside `createServerFn().handler()`
- Fix: wrap every `beforeLoad` auth check in `getSessionFn = createServerFn().handler(...)` and call it from `beforeLoad`

---

## Git Log (latest)
```
59f50b4 test(e2e): tighten project spec assertions for IRR, error guard, and count label
22d1931 test(e2e): rewrite projects spec with catalog, detail, and navigation coverage
deb11f4 feat(router): add notFoundComponent to root route
2da0578 feat(webhooks): add Sumsub webhook route and fix Stripe session type
... (full history above)
```

---

## Resuming in a New Session

> "Read docs/progress.md. M1–M9 fully complete (73 unit tests, build passes, production live at building-investment.vercel.app). Supabase seeded with 4 demo projects. Remaining: configure Stripe + Sumsub webhooks and set VITE_SENTRY_DSN in Vercel (manual dashboard steps)."
