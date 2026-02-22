# Technical Architecture - Building Investment Platform

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Database | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| DB Client | @supabase/ssr + generated types |
| Payments | Stripe Connect (SPV = connected account) |
| KYC | Sumsub |
| i18n | next-intl (`/bg/` + `/en/` prefixes) |
| UI | shadcn/ui + Tailwind CSS 4 |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Email | Resend + React Email |
| Hosting | Vercel |
| Env validation | t3-env |
| Package manager | pnpm |
| Linter/Formatter | Biome (via ultracite) |
| Error monitoring | Sentry |
| Analytics | Vercel Analytics |

No client state library needed. Server Components + Server Actions + URL state + Supabase Realtime cover all data patterns.

## Dev Tooling

### Code Quality
- **Biome** via `ultracite` - lint + format (replaces ESLint + Prettier)
- **TypeScript** strict mode with `strictNullChecks`
- **server-only** package - prevents server code from leaking to client bundle

### Git Hooks (Husky)
- **pre-commit**: `pnpm check` (Biome lint + format check via ultracite)
- **commit-msg**: `pnpm commitlint` (conventional commits enforcement)
- **pre-push**: `pnpm build` (ensure no broken builds reach remote)

### Commit Convention
- **commitlint** with `@commitlint/config-conventional`
- Format: `type(scope): subject` (e.g. `feat(invest): add investment flow`)
- Types: `feat|fix|docs|style|refactor|test|chore|perf`

### Staged Files
- **lint-staged** - runs ultracite fix on staged `*.{js,jsx,ts,tsx,json,css,md}`

### UI Implementation Workflow
- **Codex skill**: use `frontend-design` as the default workflow for building pages and UI components
- **Stack guardrails**: keep implementation aligned with shadcn/ui + Tailwind CSS 4 + Motion patterns
- **Quality bar**: validate desktop + mobile rendering before merge

### Testing
- **Jest** + `@testing-library/react` - unit tests for hooks, utils, components
- **Playwright** - E2E tests for critical flows (registration, investment, admin)
- Config: `jest.config.js` uses `next/jest`, jsdom environment, `@/` path aliases
- Coverage: `app/`, `components/`, `lib/` directories

### Release Pipeline
- **semantic-release** - automated versioning + changelog on push to `main`
- Plugins:
  - `@semantic-release/commit-analyzer` - conventional commits → version bump
  - `@semantic-release/release-notes-generator` - auto release notes
  - `@semantic-release/changelog` - writes CHANGELOG.md
  - `@semantic-release/npm` - bumps package.json (no publish)
  - `@semantic-release/git` - commits version + changelog back
  - `@semantic-release/github` - creates GitHub release
- GitHub Action: triggers on push to `main`

### Environment Management
- **dotenv-cli** - run with different env files (`dev`, `staging`, `production`)
- Scripts: `pnpm dev` (staging env), `pnpm local` (.env), `pnpm prod` (production env)
- `.env.example` committed, `.env*` ignored (except `.env.example` and `.env.vault`)

## Folder Structure

```
src/
├── app/
│   ├── [locale]/                        # bg | en
│   │   ├── (marketing)/                 # public, no auth
│   │   │   ├── page.tsx                 # landing
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx             # catalog
│   │   │   │   └── [slug]/page.tsx      # project detail (public)
│   │   │   ├── about/page.tsx
│   │   │   ├── how-it-works/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/                 # investor, auth required
│   │   │   ├── portfolio/page.tsx
│   │   │   ├── wallet/page.tsx
│   │   │   ├── investments/page.tsx
│   │   │   ├── projects/[slug]/page.tsx # invested project detail
│   │   │   ├── settings/page.tsx
│   │   │   ├── documents/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (admin)/                     # role=admin|project_owner
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── projects/               # CRUD, pipeline
│   │   │   ├── investors/              # profiles, KYC
│   │   │   ├── investments/            # cap tables, distributions
│   │   │   ├── budget/                 # CAPEX/OPEX
│   │   │   ├── contractors/
│   │   │   ├── documents/
│   │   │   └── layout.tsx
│   │   └── layout.tsx                   # root locale layout
│   ├── api/webhooks/
│   │   ├── stripe/route.ts
│   │   └── sumsub/route.ts
│   └── layout.tsx                       # root layout
├── components/
│   ├── ui/                              # shadcn/ui
│   ├── shared/
│   │   ├── project-card.tsx
│   │   ├── funding-progress.tsx
│   │   ├── investment-form.tsx
│   │   └── locale-switcher.tsx
│   ├── dashboard/
│   ├── admin/
│   └── marketing/
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # browser client
│   │   ├── server.ts                    # server component client
│   │   ├── admin.ts                     # service role (server only)
│   │   └── types.ts                     # generated DB types
│   ├── stripe/
│   │   ├── client.ts
│   │   └── actions.ts
│   ├── sumsub/
│   │   └── client.ts
│   ├── ledger/
│   │   ├── accounts.ts
│   │   ├── transactions.ts
│   │   └── balances.ts
│   └── utils/
│       ├── localize.ts
│       ├── currency.ts
│       └── validation.ts
├── actions/                             # Server Actions
│   ├── auth.ts
│   ├── invest.ts
│   ├── projects.ts
│   ├── wallet.ts
│   └── admin/
├── hooks/
│   ├── use-profile.ts
│   └── use-realtime.ts                  # Supabase Realtime wrappers
├── types/
│   ├── database.ts                      # generated from Supabase
│   └── domain.ts
├── messages/
│   ├── en.json
│   └── bg.json
├── middleware.ts                         # auth + i18n
└── env.ts                               # typed env vars
```

## Dependencies (complete)

### Production
```
# Framework
next
react
react-dom

# Supabase
@supabase/supabase-js
@supabase/ssr

# Payments
stripe
@stripe/react-stripe-js
@stripe/stripe-js

# i18n
next-intl

# UI
tailwindcss
class-variance-authority
clsx
tailwind-merge
lucide-react
sonner                    # toast notifications
motion                    # page transitions, animations
recharts                  # financial charts
sharp                     # image optimization

# Forms
react-hook-form
@hookform/resolvers
zod

# Email
resend
@react-email/components

# Monitoring
@sentry/nextjs
@vercel/analytics

# Utils
server-only               # prevent server code in client
t3-env                    # typed env validation
```

### Dev Dependencies
```
# TypeScript
typescript
@types/node
@types/react
@types/react-dom

# Linting/Formatting
@biomejs/biome
ultracite

# Git hooks
husky
lint-staged
@commitlint/cli
@commitlint/config-conventional

# Testing
jest
@jest/globals
@types/jest
jest-environment-jsdom
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
@playwright/test

# Release
semantic-release
@semantic-release/changelog
@semantic-release/commit-analyzer
@semantic-release/git
@semantic-release/github
@semantic-release/npm
@semantic-release/release-notes-generator

# Tailwind
@tailwindcss/postcss

# Env
dotenv-cli
```

## Data Flow Patterns

### Server Components (default, most pages)
```
Browser request
  → middleware (locale + auth check)
  → Server Component
  → Supabase server client (direct DB query via RLS)
  → Render HTML
  → Stream to browser
```

### Mutations (investments, admin actions)
```
User action (form submit)
  → React Hook Form validates (Zod)
  → Server Action called
  → Supabase admin/server client
  → DB write + ledger entry
  → revalidatePath() / redirect()
```

### Real-time (funding progress, wallet balance)
```
Client Component mounts
  → Supabase Realtime subscription
  → DB change triggers broadcast
  → Component re-renders with new data
```

### Payments (Stripe Connect)
```
Invest flow:
  Investor → Server Action → Stripe Checkout Session → Redirect to Stripe
  → Payment succeeds → Stripe webhook → Update DB + ledger → Notify investor

Distribution flow:
  Admin triggers → Server Action → Stripe Transfer to investor
  → Webhook confirms → Update DB + ledger → Notify investor
```

## Middleware Chain

```typescript
// middleware.ts
// 1. next-intl: detect/enforce locale prefix
// 2. Supabase: refresh session token
// 3. Route protection:
//    - /dashboard/* → requires authenticated user
//    - /admin/*     → requires role = admin | project_owner
//    - /marketing/* → public
```

## Security Boundaries

| Boundary | Mechanism |
|----------|-----------|
| Authentication | Supabase Auth (JWT in cookies, middleware refresh) |
| Authorization | RLS policies (DB level) + middleware route guards (app level) |
| Financial writes | Server Actions only, never client-side |
| Payment integrity | Stripe webhook signature verification + idempotency keys |
| KYC documents | Private storage bucket, RLS-controlled access |
| CSRF | Server Actions built-in protection |
| Input validation | Zod schemas shared client + server |
| Audit | DB triggers log all changes to audit_log table |
| Server isolation | `server-only` package on all server modules |
| Error tracking | Sentry with source maps (Vercel integration) |

## i18n Strategy

- URL: `/bg/projects/sofia-apartment` and `/en/projects/sofia-apartment`
- UI strings: `messages/bg.json` and `messages/en.json` via next-intl
- DB content: `title_bg` / `title_en` columns, resolved by `getLocalizedField(obj, field, locale)`
- Default locale: `bg` (Bulgarian market first)
- Locale detection: browser preference → cookie → default

## Supabase Storage Buckets

| Bucket | Read | Write | Content |
|--------|------|-------|---------|
| `project-images` | Public | Admin | Covers, gallery |
| `project-documents` | RLS | Admin | Contracts, KIIS, valuations |
| `kyc-documents` | Owner + Admin | Owner | ID, proof of address |
| `progress-media` | Authenticated | Admin | Construction photos/video |
| `avatars` | Public | Owner | Profile pictures |

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Sumsub
SUMSUB_APP_TOKEN=
SUMSUB_SECRET_KEY=

# Resend
RESEND_API_KEY=

# Sentry
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# App
NEXT_PUBLIC_APP_URL=
```

## CI/CD Pipeline

### GitHub Actions

**Release** (on push to `main`):
1. Checkout + pnpm install
2. Disable husky in CI
3. Run semantic-release (auto version + changelog + GitHub release)

**Future additions**:
- PR checks: lint + typecheck + unit tests + build
- E2E: Playwright against preview deployment
- Dependabot for dependency updates

### Vercel
- Auto-deploy `main` → production
- Auto-deploy PR branches → preview URLs
- Environment variables per environment (dev/preview/production)

## Build Sequence (MVP phases)

### Delivery Rule (Mandatory)
- All implementation is **TDD-first**: write failing tests first, implement minimal code to pass, then refactor safely.
- Every feature PR must include tests for the behavior it introduces or changes.
- Minimum verification before merge: unit/integration tests + relevant Playwright flow for user-facing changes.

### Phase 1: Foundation
- Next.js project setup + Tailwind + shadcn/ui
- Dev tooling (Biome, Husky, commitlint, lint-staged)
- Supabase project + schema migration
- Auth (register, login, profile)
- i18n setup (next-intl)
- Middleware (auth + i18n)
- Sentry integration
- CI/CD (Vercel + GitHub Actions)
- TDD baseline: test setup, sample red-green-refactor flow, CI gate for tests

### Phase 2: Public site
- Landing page
- Project catalog (list + filters)
- Project detail page (public view)
- How it works / About
- TDD gate: page/component tests + critical browse/search E2E coverage

### Phase 3: Investor dashboard
- KYC integration (Sumsub)
- Investment flow (select amount → terms → Stripe Checkout)
- Portfolio view
- Wallet / ledger (read-only for investors)
- Documents access
- Progress updates view
- TDD gate: server actions, validation, and payment flow tests before feature completion

### Phase 4: Admin panel
- Project CRUD + pipeline
- Investor management
- Cap table per project
- Budget tracking (CAPEX/OPEX)
- Document management
- Progress update publishing
- Distribution management
- TDD gate: admin authorization + mutation path tests with RLS-sensitive scenarios

### Phase 5: Polish + launch
- Email notifications (Resend)
- Real-time updates (funding progress, wallet)
- SEO optimization
- Error handling + monitoring
- Security audit
- Production deployment
- Semantic-release setup
- TDD gate: regression suite pass before launch sign-off
