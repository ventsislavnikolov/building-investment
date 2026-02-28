# Full Rewrite Design — Building Investment Platform
Date: 2026-02-28
Status: Approved

---

## Decision

Full rewrite from Next.js → TanStack Start. Delete all `src/` code. Keep all architecture docs and DB schema unchanged.

---

## Tech Stack

### Keep
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Database schema (`docs/database-schema.sql`) — unchanged
- shadcn/ui + Tailwind CSS 4
- Stripe Connect (payments)
- Sumsub (KYC)
- Resend (email)
- Sentry + Vercel Analytics
- Biome (via ultracite), Husky, commitlint, semantic-release
- Jest + Playwright
- pnpm + Vercel hosting

### Replace
| Old | New |
|-----|-----|
| Next.js 15 | TanStack Start (Vinxi + Nitro) |
| App Router | TanStack Router (file-based, type-safe) |
| Server Actions | TanStack Start server functions (`createServerFn`) |
| Server Components | Server loaders (`loader` in route definitions) |
| next-intl | Custom i18n — simple `t()` helper + optional `/bg/` path prefix |
| — | TanStack Query (client-side cache + realtime bridge) |
| — | TanStack Form + Zod |
| — | TanStack Store (locale, theme, global UI state) |
| next/image | `<img>` + Supabase storage URLs |

---

## i18n Strategy

- **English** = default locale, no URL prefix → `/projects`, `/dashboard`
- **Bulgarian** = `/bg/` prefix → `/bg/projects`, `/bg/dashboard`
- TanStack Router: optional `$locale` segment at root. If absent or not `"bg"` → `"en"`.
- `beforeLoad` in root route normalizes locale, puts it in router context.
- `t(locale, key)` helper reads from `messages/en.json` and `messages/bg.json`.

---

## Design System (Keyturn-inspired)

### Reference
Primary inspiration: Keyturn (Behance #169315941). We recreate the layout patterns and visual language with our own brand.

### Colors
```
Primary blue:     #1B59E8
Light blue:       #CEE8FB
Page background:  #EEF2F6
Gray muted:       #ACB3BA
Dark text:        #151515
White (cards):    #FFFFFF
Success green:    #22C55E
Active indicator: #1B59E8 (3px left border)
```

### Typography
- **Font:** Plus Jakarta Sans (free replacement for Cera Pro — same geometric rounded personality)
- H1 marketing: 60–72px Bold `#151515`
- H1 dashboard: 32–36px Bold
- Body: 14–16px Regular
- Financial values: Bold `#151515`
- Financial labels: 13px `#1B59E8`
- Muted/timestamps: `#ACB3BA`

### App Shell
```
Outer frame: #1B59E8 background (full page)
Inner card:  white, large border-radius (~24px), contains the entire app
Header bar:  Logo + collapse toggle + Page title | Notification bell + Avatar + Name/email
Sidebar:     64px icon-only, collapsible to show text labels
             Active item: 3px blue left border
             Bottom: Help + Logout icons
Content:     White, full height, scrollable
```

### Sidebar Navigation Items
| Icon | Label | Route |
|------|-------|-------|
| Search | Browse projects | `/projects` |
| List | My investments | `/dashboard/investments` |
| Chart | Portfolio | `/dashboard/portfolio` |
| Bell | Notifications | `/dashboard/notifications` |
| House | Favorites | `/dashboard/favorites` |
| Gear | Settings | `/dashboard/settings` |
| ? | Help | — |
| Arrow-out | Log out | — |

Admin sidebar adds: Projects, Investors, Investments, Budget, Contractors, Documents, Audit, Metrics.

### Property Card
```
[Full-width photo] [♥ bookmark icon]
[FUNDED X% badge — bottom right of image]
$TARGET_AMOUNT          Listed X days ago
Strategy · City · Property type
Address (district revealed after investment)
────────────────────────────────
Min. investment    IRR           Duration
€X,XXX             X–X%          X months
Gross yield        Funding progress
XX%                [progress bar] XX%
```

### Project Detail Layout
```
[← Back]                       [Invest Now] [Save]
┌──────────────────────┬─────────────────────────┐
│ [Image gallery]      │ Financial snapshot       │
│ [slide indicators]   │ [1yr] 5yr 10yr exit      │
│                      │ Key metrics              │
│ Title + City         │ Min. investment  €X,XXX  │
│ Strategy badge       │ Target IRR       X–X%    │
│                      │ Duration         X mo    │
│ Beds/Baths/SQM       │ Funded           XX%     │
│ Year built           │ Investors        XXX     │
│                      │ ────────────────────     │
│                      │ Financial projection     │
│                      │ [bar chart by year]      │
├──────────────────────┼─────────────────────────┤
│ Investment calc      │ [Invest] [Contact]       │
│ Amount slider        │ [Map — district pin]     │
├──────────────────────┴─────────────────────────┤
│ Detailed financials     [RETURNS] [OTHER]       │
│ ─────  1yr  2yr  3yr  5yr  10yr  exit          │
│ Cumulative return ...                           │
│ Capital returned ...                            │
│ IRR realized ...                                │
├─────────────────────────────────────────────────┤
│ Visualize returns [stacked bar + line, exit]    │
└─────────────────────────────────────────────────┘
```

### Checkout Page
- Standalone (no sidebar), logo only
- Left: payment selector (Stripe card form + Apple/Google Pay options)
- Right: "Investment Summary" light-blue card — project thumbnail + key metrics + amount + fees + total + "Complete Investment" blue button

### Success Page
- Logo only, centered, light-blue icon circle, bold confirmation, single blue pill CTA → dashboard

### Marketing Landing Page Sections
1. **Nav:** Logo | Solutions, How it works, About | Login + "Get started" (blue pill)
2. **Hero:** Left — H1 + subtext + email/CTA. Right — floating dashboard screenshot
3. **Stats bar:** €Xm invested · X investors · X.X% avg IRR · X projects completed
4. **Feature cards:** 4-col (Discover projects, Analyze returns, Invest securely, Track progress)
5. **Feature sections:** Alternating content+screenshot blocks with CTAs
6. **Blue CTA banner:** "Thinking about investing?" + "Book a call" white outlined button
7. **Advantage section:** 3-col cards (Find · Invest · Earn)
8. **Social proof:** Trust logos or testimonials
9. **Email CTA banner:** Full blue bg, newsletter signup
10. **Footer:** Logo + tagline + social | Product links | Company links | Newsletter

---

## Page Inventory (35 routes)

### Marketing
| Route | Page |
|-------|------|
| `/` | Landing |
| `/projects` | Project catalog (search, filter, sort, map toggle, 4-col cards) |
| `/projects/:slug` | Project detail (public) |
| `/how-it-works` | How it works |
| `/about` | About |

### Auth (standalone, no sidebar)
| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Password reset |

### Investment Flow
| Route | Page |
|-------|------|
| `/projects/:slug/invest` | Investment checkout |
| `/projects/:slug/invest/success` | Investment success |

### Investor Dashboard
| Route | Page |
|-------|------|
| `/dashboard` | Overview — KPI cards + quick links |
| `/dashboard/investments` | My investments — card grid, sort/filter |
| `/dashboard/portfolio` | Portfolio analytics — IRR, allocation, returns charts |
| `/dashboard/wallet` | Wallet — balance + ledger |
| `/dashboard/transactions` | Transactions — table |
| `/dashboard/distributions` | Distributions — table |
| `/dashboard/favorites` | Watchlist — saved filter rows + mini project cards |
| `/dashboard/progress` | Project updates — timeline feed |
| `/dashboard/documents` | Documents — grouped by category |
| `/dashboard/notifications` | Notifications — list with read/unread |
| `/dashboard/kyc` | KYC — status + Sumsub embed |
| `/dashboard/settings` | Settings — Profile / Password / Notifications tabs |
| `/dashboard/statements` | Statements — downloadable PDFs |
| `/dashboard/projects/:slug` | Invested project detail |

### Admin
| Route | Page |
|-------|------|
| `/admin/dashboard` | Admin overview |
| `/admin/projects` | Projects list + pipeline |
| `/admin/projects/new` | Create project |
| `/admin/projects/:id` | Edit project |
| `/admin/investors` | Investors list |
| `/admin/investors/:id` | Investor detail |
| `/admin/investments` | Cap table |
| `/admin/budget` | Budget items |
| `/admin/contractors` | Contractors |
| `/admin/documents` | Document management |
| `/admin/audit` | Audit log |
| `/admin/metrics` | Platform metrics |

---

## Responsive Design

Every page must work at all breakpoints. No exceptions.

### Breakpoints
```
Mobile:  < 768px  — single column, bottom nav replaces sidebar
Tablet:  768–1024px — sidebar collapses to icon-only (64px)
Desktop: > 1024px — sidebar expanded or icon-only (user toggle)
```

### Rules
- Mobile-first CSS: base styles = mobile, add `md:` / `lg:` overrides
- Sidebar: hidden on mobile (hamburger menu + slide-over), icon-only on tablet, collapsible on desktop
- Property cards: 1-col mobile → 2-col tablet → 4-col desktop
- Admin tables: horizontal scroll on mobile, full layout on desktop
- Financial charts: full-width on all breakpoints, simplified on mobile (remove legend clutter)
- Touch targets: min 44×44px on mobile
- Font sizes: reduce H1 marketing from 72px → 40px on mobile
- Test: every UI task must be verified at 375px (iPhone SE), 768px (iPad), 1440px (desktop)

---

## Error Monitoring (Sentry)

- SDK: `@sentry/tanstackstart-react`
- Captures: unhandled exceptions, server function errors, slow transactions
- Source maps: uploaded on every Vercel deploy via Sentry GitHub integration
- Custom error boundaries: wrap each route subtree — `<SentryErrorBoundary>` with fallback UI
- Manual capture: `Sentry.captureException(err)` in all catch blocks in server functions
- Environment tagging: `SENTRY_ENVIRONMENT` = `development` | `staging` | `production`
- Alert rules: notify on new issue, > 10 events/hour, performance regression > 20%
- Inspect errors: use Chrome DevTools MCP to check browser console, use Vercel MCP to view deploy logs

---

## Development Workflow

### MCP Servers
| MCP | When to use |
|-----|-------------|
| **Supabase** | Run migrations, query DB, manage RLS policies, inspect tables |
| **Vercel** | Deploy, check deploy logs, debug preview URLs, manage env vars |
| **Chrome DevTools** | Inspect console errors, network requests, performance traces |
| **shadcn** | Add shadcn components, browse available components, get examples |
| **context7** | Look up latest API docs for TanStack Start/Router/Query, Supabase, Stripe |
| **Linear** | Create/update milestones, features, tasks; mark as complete after each commit |
| **Stripe** | Manage products, test webhooks, inspect payment intents |
| **Playwright** | Run E2E tests, record flows, debug failures with screenshots/traces |

### Skills
| When | Skill |
|------|-------|
| Before every feature | `tdd` (Matt Pocock) — red-green-refactor |
| Building any UI page | `frontend-design` |
| Before claiming done | `superpowers:verification-before-completion` |
| Bug appears | `superpowers:systematic-debugging` |
| Phase complete | `superpowers:requesting-code-review` |
| Creating commits | `create-commit` |
| Build broken | `stabilize` |

### Parallel Subagent Strategy
Independent work dispatched via `superpowers:dispatching-parallel-agents`:

```
Phase 1 (sequential): Foundation
  TanStack Start + Router + Query + Store + Form
  Supabase auth + server functions
  i18n (t() helper, en/bg, /bg/ prefix routing)
  Design tokens (CSS vars, Plus Jakarta Sans, shadcn theme)
  Biome + Husky + commitlint + Sentry

Phase 2 (parallel after Phase 1):
  Agent A: Marketing landing + how-it-works + about
  Agent B: Auth pages (login, register, forgot-password)
  Agent C: shadcn/ui component library + shared components

Phase 3 (parallel after Phase 2):
  Agent A: Project catalog + project detail (public)
  Agent B: Dashboard shell + sidebar nav + all dashboard pages
  Agent C: Investment checkout + Stripe + success page

Phase 4 (parallel after Phase 3):
  Agent A: All admin pages
  Agent B: KYC (Sumsub) + email (Resend) + Realtime

Phase 5 (sequential): Polish + launch
  SEO, perf, security audit, E2E tests, production deploy
```

### Linear Project Structure
Milestones → Features → Tasks, managed via Linear MCP.

**Milestones:**
1. Foundation
2. Marketing Site
3. Auth Flow
4. Public Project Pages
5. Investment Flow + Stripe
6. Investor Dashboard
7. Admin Panel
8. KYC + Emails + Realtime
9. Polish + Launch

Each milestone contains features. Each feature contains tasks.
TDD: every task starts with a failing test before implementation.
Progress updated in Linear after each task completes.

---

## Open Questions (resolved)
- ~~Framework~~ → TanStack Start
- ~~i18n~~ → EN default (no prefix), BG = /bg/
- ~~Design~~ → Keyturn-inspired, Plus Jakarta Sans, #1B59E8 blue
- ~~Linear~~ → Set up Linear MCP (`claude mcp add linear -- npx -y @linear/mcp-server`)
- ~~TDD~~ → `tdd` skill (Matt Pocock), available after restart
- ~~MCPs~~ → Supabase, Vercel, Chrome DevTools, shadcn, context7, Linear, Stripe, Playwright
- ~~Error monitoring~~ → Sentry (`@sentry/tanstackstart-react`) + Vercel MCP + Chrome DevTools MCP
- ~~Responsive~~ → Mobile-first, all pages tested at 375px / 768px / 1440px
