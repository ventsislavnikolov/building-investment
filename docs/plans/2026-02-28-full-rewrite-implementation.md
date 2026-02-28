# Full Rewrite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the building investment platform from Next.js → TanStack Start with Keyturn-inspired UI, real Supabase data, Stripe payments, and full investor + admin flows.

**Architecture:** TanStack Start (Vinxi + Nitro) for SSR/server functions, TanStack Router for file-based type-safe routing with optional `($locale)` segment (EN = no prefix, BG = `/bg/`), TanStack Query for client cache, TanStack Form + Zod for forms, TanStack Store for global client state. All auth and mutations go through `createServerFn`. Supabase RLS enforced at DB level.

**Tech Stack:** TanStack Start, TanStack Router, TanStack Query, TanStack Form, TanStack Store, Supabase SSR, shadcn/ui, Tailwind CSS 4, Plus Jakarta Sans, Stripe, Sumsub, Resend, Recharts, Sentry, Biome, Jest, Playwright, pnpm, Vercel

**Design Reference:** Keyturn (Behance #169315941) — blue `#1B59E8` primary, `#EEF2F6` bg, `#151515` text, Plus Jakarta Sans, icon-only collapsible sidebar, white card app shell on blue outer frame. Full screen index: `design-images/SCREENS.md`.

**TDD Rule:** Every task starts with a failing test. Never write implementation before the test is red.
**Skill to use for UI tasks:** `frontend-design`
**Skill to use for debugging:** `superpowers:systematic-debugging`
**Skill to use before any commit claiming "done":** `superpowers:verification-before-completion`
**Responsive rule:** Every UI task must render correctly at 375px, 768px, 1440px. Verify with Playwright MCP or Chrome DevTools MCP before marking done.

---

## Design Image Reference

All reference images are in `design-images/`. Full index: `design-images/SCREENS.md`.

| Image file | Screen | Use when building |
|------------|--------|-------------------|
| `2f6699...9e041.png` | Design system — colors + font | Task 1.1 (tokens), any page |
| `35293a...a04ad.png` + `35293a(1)...png` | Marketing landing page | Task 2.2 (landing) |
| `5dc528...a4469.png` | Property catalog + map + filter panel | Task 4.1 (catalog) |
| `faf442...a1378.png` | Project detail top — financial snapshot panel | Task 4.2 (detail top) |
| `051a85...a6974.png` | Project detail full — calculator, financials table, charts | Task 4.2 (detail scroll) |
| `67cbfb...9b2b4.png` | Checkout (payment form + billing summary) + success | Task 5.2 (checkout), Task 5.3 (success) |
| `bbc941...a2270.png` | Portfolio / analyze tool — form + metrics + charts | Task 6.4 (portfolio) |
| `f5aac4...a57d1.png` | Saved searches / watchlist | Task 6.6 (favorites) |
| `0371e3...9d1d7.png` | Messages and notifications | Task 6.10 (notifications) |
| `f3512a...a32d0.png` | Settings (all tabs) + Help | Task 6.12 (settings) |

### Playwright Visual Check Pattern

Every UI milestone task should end with a visual check:

```typescript
// tests/e2e/visual/[page].spec.ts
import { test, expect } from '@playwright/test'

test('project catalog matches design', async ({ page }) => {
  await page.goto('/projects')
  await page.waitForLoadState('networkidle')
  // Compare key layout elements — not pixel-perfect, check structure
  await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible()
  await expect(page.locator('[data-testid="filter-bar"]')).toBeVisible()
  // Take screenshot for manual comparison against design-images/5dc528...png
  await page.screenshot({ path: 'tests/screenshots/projects-catalog.png', fullPage: true })
})
```

Screenshot output path: `tests/screenshots/[page].png`
Compare manually against `design-images/` reference using Playwright MCP trace viewer.

---

## MCP Tool Reference

| Task type | MCP to use |
|-----------|------------|
| DB migrations, table queries, RLS policy changes | **Supabase MCP** |
| Deploy to preview/production, check deploy logs, env vars | **Vercel MCP** |
| Inspect console errors, network, performance | **Chrome DevTools MCP** |
| Add or browse shadcn/ui components | **shadcn MCP** |
| Look up current API docs (TanStack, Supabase, Stripe, etc.) | **context7 MCP** |
| Create/update/close Linear milestones, features, tasks | **Linear MCP** |
| Stripe products, webhook tests, payment intent inspection | **Stripe MCP** |
| Run E2E tests, record flows, debug failures | **Playwright MCP** |

**After every completed task:** update Linear task to Done via Linear MCP.
**On any console error:** use Chrome DevTools MCP to inspect, Sentry to track.
**On deploy failure:** use Vercel MCP to read logs before debugging.

---

## Responsive Design Requirements

All pages mobile-first. Base styles = mobile. Add `md:` and `lg:` overrides.

| Breakpoint | Behavior |
|------------|----------|
| < 768px (mobile) | Single column, sidebar hidden (hamburger → slide-over drawer) |
| 768–1024px (tablet) | Sidebar icon-only (64px), 2-col grids |
| > 1024px (desktop) | Sidebar collapsible (icon-only or with labels), 4-col grids |

Touch targets: min 44×44px. Property cards: 1 → 2 → 4 cols. Tables: horizontal scroll on mobile. Charts: full-width all sizes.

---

## Linear Structure

Create in Linear before starting:

**Milestones:**
1. M1 · Foundation
2. M2 · Marketing Site
3. M3 · Auth Pages
4. M4 · Public Project Pages
5. M5 · Investment Flow + Stripe
6. M6 · Investor Dashboard
7. M7 · Admin Panel
8. M8 · KYC + Emails + Realtime
9. M9 · Polish + Launch

---

## M1 · Foundation

### Task 1.1: Delete old code, scaffold TanStack Start

**Files:**
- Delete: `src/` (entire directory)
- Keep: `docs/`, `public/`, `.husky/`, `biome.json`, `commitlint.config.cjs`, `pnpm-workspace.yaml`
- Create: new TanStack Start project structure

**Step 1: Delete old src and stale configs**
```bash
rm -rf src/
rm -f next.config.ts jest.config.mjs jest.setup.ts playwright.config.ts tsconfig.json postcss.config.mjs vercel.json
```

**Step 2: Scaffold TanStack Start**
```bash
pnpm create tanstack-app@latest . --template react-start --package-manager pnpm
```
Accept overwrite of package.json. Review what it creates.

**Step 3: Install additional dependencies**
```bash
# TanStack
pnpm add @tanstack/react-query @tanstack/react-form @tanstack/store @tanstack/react-query-devtools

# Supabase
pnpm add @supabase/supabase-js @supabase/ssr

# Stripe
pnpm add stripe @stripe/stripe-js @stripe/react-stripe-js

# UI
pnpm add tailwindcss @tailwindcss/vite class-variance-authority clsx tailwind-merge lucide-react sonner motion recharts

# Forms + validation
pnpm add zod @hookform/resolvers

# Email
pnpm add resend @react-email/components

# Monitoring
pnpm add @sentry/tanstackstart-react @vercel/analytics

# Utils
pnpm add server-only

# i18n (no library — custom t() helper only)

# Dev
pnpm add -D @biomejs/biome ultracite @types/node
pnpm add -D jest @jest/globals @types/jest jest-environment-jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D @playwright/test
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

**Step 4: Configure Tailwind CSS 4**

Create `app/styles/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-primary: #1b59e8;
  --color-primary-light: #cee8fb;
  --color-primary-hover: #1448c7;
  --color-background: #eef2f6;
  --color-surface: #ffffff;
  --color-text: #151515;
  --color-muted: #acb3ba;
  --color-success: #22c55e;
  --color-destructive: #dc2626;
  --color-warning: #d97706;
  --color-border: #e4e4e7;

  --font-sans: "Plus Jakarta Sans", sans-serif;
  --font-mono: "Geist Mono", monospace;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

**Step 5: Add Plus Jakarta Sans font**

In `app/root.tsx`:
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Step 6: Commit**
```bash
git add -A
git commit -m "chore(scaffold): init TanStack Start with full dependency set"
```

---

### Task 1.2: Environment variables + typed env

**Files:**
- Create: `app/env.ts`
- Create: `.env.example`

**Step 1: Write failing test**
```typescript
// tests/unit/env.test.ts
import { describe, it, expect } from '@jest/globals'

describe('getEnv', () => {
  it('throws when required vars are missing', () => {
    expect(() => getEnv({})).toThrow('Missing or invalid environment variables')
  })

  it('returns parsed env when all vars present', () => {
    const env = getEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'service-key',
      NEXT_PUBLIC_APP_URL: 'https://localhost:3000',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_xxx',
      STRIPE_SECRET_KEY: 'sk_test_xxx',
      STRIPE_WEBHOOK_SECRET: 'whsec_xxx',
    })
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co')
  })
})
```

**Step 2: Run to verify red**
```bash
pnpm test tests/unit/env.test.ts
```
Expected: FAIL — `getEnv` not found.

**Step 3: Implement**
```typescript
// app/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  SUMSUB_APP_TOKEN: z.string().optional(),
  SUMSUB_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
})

export type AppEnv = z.infer<typeof envSchema>

export function getEnv(source: Record<string, string | undefined>): AppEnv {
  const parsed = envSchema.safeParse(source)
  if (!parsed.success) throw new Error('Missing or invalid environment variables')
  return parsed.data
}

let cached: AppEnv | null = null
export function getRuntimeEnv(): AppEnv {
  if (!cached) cached = getEnv(process.env as Record<string, string | undefined>)
  return cached
}
```

**Step 4: Run to verify green**
```bash
pnpm test tests/unit/env.test.ts
```

**Step 5: Commit**
```bash
git add app/env.ts tests/unit/env.test.ts .env.example
git commit -m "feat(env): add typed environment validation with Zod"
```

---

### Task 1.3: Supabase clients (browser + server + admin)

**Files:**
- Create: `app/lib/supabase/client.ts`
- Create: `app/lib/supabase/server.ts`
- Create: `app/lib/supabase/admin.ts`
- Test: `tests/unit/supabase-client.test.ts`

**Step 1: Write failing test**
```typescript
// tests/unit/supabase-client.test.ts
import { describe, it, expect, vi } from '@jest/globals'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: {}, from: vi.fn() }))
}))

describe('createBrowserClient', () => {
  it('creates a client with public env vars', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    const { createBrowserClient } = require('./app/lib/supabase/client')
    const client = createBrowserClient()
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
  })
})
```

**Step 2: Run to verify red**
```bash
pnpm test tests/unit/supabase-client.test.ts
```

**Step 3: Implement**

```typescript
// app/lib/supabase/client.ts
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { getRuntimeEnv } from '~/env'

export function createBrowserClient() {
  const env = getRuntimeEnv()
  return createSupabaseBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
```

```typescript
// app/lib/supabase/server.ts
// Used inside createServerFn context (Nitro H3)
import { createServerClient } from '@supabase/ssr'
import { getCookie, setCookie } from 'vinxi/http'
import { getRuntimeEnv } from '~/env'

export function createSupabaseServerClient() {
  const env = getRuntimeEnv()
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          // Nitro H3 cookie access
          const cookieHeader = getCookie('sb-auth-token') ?? ''
          return [{ name: 'sb-auth-token', value: cookieHeader }]
        },
        setAll(cookies) {
          for (const { name, value, options } of cookies) {
            setCookie(name, value, options)
          }
        },
      },
    },
  )
}
```

```typescript
// app/lib/supabase/admin.ts
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { getRuntimeEnv } from '~/env'

export function createSupabaseAdminClient() {
  const env = getRuntimeEnv()
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
```

**Step 4: Run tests**
```bash
pnpm test tests/unit/supabase-client.test.ts
```

**Step 5: Commit**
```bash
git add app/lib/supabase/
git commit -m "feat(supabase): add browser, server and admin clients"
```

---

### Task 1.4: i18n helper (t() function)

**Files:**
- Create: `app/lib/i18n/index.ts`
- Create: `app/messages/en.json`
- Create: `app/messages/bg.json`
- Test: `tests/unit/i18n.test.ts`

**Step 1: Write failing test**
```typescript
// tests/unit/i18n.test.ts
import { describe, it, expect } from '@jest/globals'

describe('t()', () => {
  it('returns English string for en locale', () => {
    const { t } = require('~/lib/i18n')
    expect(t('en', 'common.loading')).toBe('Loading...')
  })

  it('returns Bulgarian string for bg locale', () => {
    const { t } = require('~/lib/i18n')
    expect(t('bg', 'common.loading')).toBe('Зареждане...')
  })

  it('falls back to key when string missing', () => {
    const { t } = require('~/lib/i18n')
    expect(t('en', 'nonexistent.key')).toBe('nonexistent.key')
  })
})
```

**Step 2: Run to verify red**

**Step 3: Implement**

```typescript
// app/lib/i18n/index.ts
import en from '~/messages/en.json'
import bg from '~/messages/bg.json'

export type Locale = 'en' | 'bg'
export const locales: Locale[] = ['en', 'bg']
export const defaultLocale: Locale = 'en'

type Messages = typeof en

const messages: Record<Locale, Messages> = { en, bg }

export function t(locale: Locale, key: string): string {
  const parts = key.split('.')
  let value: unknown = messages[locale] ?? messages.en
  for (const part of parts) {
    if (typeof value !== 'object' || value === null) return key
    value = (value as Record<string, unknown>)[part]
  }
  return typeof value === 'string' ? value : key
}

export function isSupportedLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'bg'
}
```

Create `app/messages/en.json` and `app/messages/bg.json` with all keys needed (copy existing ones from `docs/` reference, expand as features are built).

**Step 4: Run to verify green**

**Step 5: Commit**
```bash
git add app/lib/i18n/ app/messages/
git commit -m "feat(i18n): add t() helper with en/bg messages"
```

---

### Task 1.5: TanStack Router setup with optional locale segment

**Files:**
- Modify: `app/router.tsx`
- Create: `app/routes/__root.tsx`
- Create: `app/routes/($locale)/_layout.tsx`
- Create: `app/routes/($locale)/index.tsx` (placeholder)

**Step 1: Write failing test**
```typescript
// tests/unit/routing.test.ts
import { describe, it, expect } from '@jest/globals'

describe('getLocaleFromParams', () => {
  it('returns en when no locale param', () => {
    const { getLocaleFromParams } = require('~/lib/routing')
    expect(getLocaleFromParams(undefined)).toBe('en')
  })

  it('returns bg when locale param is bg', () => {
    const { getLocaleFromParams } = require('~/lib/routing')
    expect(getLocaleFromParams('bg')).toBe('bg')
  })

  it('returns en for unknown locale param', () => {
    const { getLocaleFromParams } = require('~/lib/routing')
    expect(getLocaleFromParams('fr')).toBe('en')
  })
})
```

**Step 2: Run to verify red**

**Step 3: Implement**

```typescript
// app/lib/routing.ts
import { type Locale, isSupportedLocale, defaultLocale } from '~/lib/i18n'

export function getLocaleFromParams(param: string | undefined): Locale {
  if (!param) return defaultLocale
  return isSupportedLocale(param) ? param : defaultLocale
}

export function localePath(locale: Locale, path: string): string {
  if (locale === 'en') return path
  return `/${locale}${path}`
}
```

```tsx
// app/routes/($locale)/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getLocaleFromParams } from '~/lib/routing'

export const Route = createFileRoute('/($locale)/_layout')({
  beforeLoad: ({ params }) => {
    const locale = getLocaleFromParams((params as { locale?: string }).locale)
    return { locale }
  },
  component: function LocaleLayout() {
    return <Outlet />
  },
})
```

**Step 4: Run tests**

**Step 5: Commit**
```bash
git commit -m "feat(routing): add TanStack Router with optional locale segment"
```

---

### Task 1.6: Auth server functions (login, register, logout, getSession)

**Files:**
- Create: `app/lib/auth/session.server.ts`
- Create: `app/server/auth.ts` (server functions)
- Test: `tests/unit/auth.test.ts`

**Step 1: Write failing tests**
```typescript
// tests/unit/auth.test.ts
import { describe, it, expect, vi, beforeEach } from '@jest/globals'

const mockSignIn = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()
const mockGetUser = vi.fn()

vi.mock('~/lib/supabase/server', () => ({
  createSupabaseServerClient: () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
  }),
}))

describe('loginAction', () => {
  it('returns error when credentials invalid', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid credentials' } })
    const { loginAction } = require('~/server/auth')
    const result = await loginAction({ email: 'a@b.com', password: 'wrong' })
    expect(result.error).toBe('Invalid credentials')
  })

  it('returns success when credentials valid', async () => {
    mockSignIn.mockResolvedValue({ data: { user: { id: '123' } }, error: null })
    const { loginAction } = require('~/server/auth')
    const result = await loginAction({ email: 'a@b.com', password: 'correct' })
    expect(result.success).toBe(true)
  })
})

describe('getSessionUser', () => {
  it('returns null when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const { getSessionUser } = require('~/server/auth')
    const user = await getSessionUser()
    expect(user).toBeNull()
  })
})
```

**Step 2: Run to verify red**

**Step 3: Implement**
```typescript
// app/server/auth.ts
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'
import { createSupabaseServerClient } from '~/lib/supabase/server'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginAction = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) return { error: error.message }
    return { success: true }
  })

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

export const registerAction = createServerFn({ method: 'POST' })
  .validator(registerSchema)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { first_name: data.firstName, last_name: data.lastName } },
    })
    if (error) return { error: error.message }
    return { success: true }
  })

export const logoutAction = createServerFn({ method: 'POST' })
  .handler(async () => {
    const supabase = createSupabaseServerClient()
    await supabase.auth.signOut()
    return { success: true }
  })

export const getSessionUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    return data.user ?? null
  })

export const getSessionProfile = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
    return data
  })
```

**Step 4: Run tests**

**Step 5: Commit**
```bash
git commit -m "feat(auth): add login, register, logout and getSession server functions"
```

---

### Task 1.7: Route guards (dashboard + admin beforeLoad)

**Files:**
- Create: `app/lib/auth/guards.ts`
- Test: `tests/unit/guards.test.ts`

**Step 1: Write failing tests**
```typescript
// tests/unit/guards.test.ts
import { describe, it, expect } from '@jest/globals'

describe('requireAuth', () => {
  it('throws redirect when user is null', () => {
    const { requireAuth } = require('~/lib/auth/guards')
    expect(() => requireAuth(null, 'en')).toThrow()
  })

  it('returns user when authenticated', () => {
    const { requireAuth } = require('~/lib/auth/guards')
    const user = { id: '123', email: 'a@b.com' }
    expect(requireAuth(user, 'en')).toEqual(user)
  })
})

describe('requireAdmin', () => {
  it('throws redirect when role is investor', () => {
    const { requireAdmin } = require('~/lib/auth/guards')
    expect(() => requireAdmin({ id: '1', role: 'investor' }, 'en')).toThrow()
  })

  it('returns profile when role is admin', () => {
    const { requireAdmin } = require('~/lib/auth/guards')
    const profile = { id: '1', role: 'admin' }
    expect(requireAdmin(profile, 'en')).toEqual(profile)
  })
})
```

**Step 2: Run to verify red**

**Step 3: Implement**
```typescript
// app/lib/auth/guards.ts
import { redirect } from '@tanstack/react-router'
import type { Locale } from '~/lib/i18n'
import { localePath } from '~/lib/routing'

export function requireAuth<T extends { id: string }>(
  user: T | null,
  locale: Locale,
): T {
  if (!user) {
    throw redirect({ to: localePath(locale, '/login') })
  }
  return user
}

export function requireAdmin<T extends { id: string; role: string }>(
  profile: T | null,
  locale: Locale,
): T {
  if (!profile || !['admin', 'project_owner'].includes(profile.role)) {
    throw redirect({ to: localePath(locale, '/dashboard') })
  }
  return profile
}
```

**Step 4: Run tests**

**Step 5: Commit**
```bash
git commit -m "feat(auth): add route guard helpers for dashboard and admin"
```

---

### Task 1.8: shadcn/ui setup + base components

**Files:**
- Run shadcn init
- Customise theme to match Keyturn design tokens
- Add initial components: Button, Input, Card, Badge, Avatar, Separator, Tooltip, Sheet, Dialog, DropdownMenu, Select, Skeleton, Progress, Tabs, Table

**Step 1: Init shadcn**
```bash
pnpm dlx shadcn@latest init
```
Choose: TypeScript, Tailwind CSS 4, no src directory, use `~/` alias.

**Step 2: Update `components.json` theme to match design tokens**
- Set primary to `#1B59E8`
- Set background to `#EEF2F6`
- Set card to `#FFFFFF`
- Set muted to `#ACB3BA`
- Set radius to `0.75rem` (12px)

**Step 3: Add base components**
```bash
pnpm dlx shadcn@latest add button input card badge avatar separator tooltip sheet dialog dropdown-menu select skeleton progress tabs table
```

**Step 4: Write snapshot test for Button**
```typescript
// tests/unit/components/button.test.tsx
import { render } from '@testing-library/react'
import { Button } from '~/components/ui/button'

it('renders primary button', () => {
  const { getByRole } = render(<Button>Invest</Button>)
  expect(getByRole('button', { name: 'Invest' })).toBeDefined()
})
```

**Step 5: Commit**
```bash
git commit -m "feat(ui): init shadcn with Keyturn design tokens and base components"
```

---

### Task 1.9: App shell layout components

> Use `frontend-design` skill for this task.
> **Design refs:** `faf442...png` (top bar + sidebar layout), `5dc528...png` (sidebar nav items active state), `f3512a...png` (sidebar with Settings active)

**Files:**
- Create: `app/components/shell/app-shell.tsx`
- Create: `app/components/shell/sidebar.tsx`
- Create: `app/components/shell/top-bar.tsx`
- Create: `app/components/shell/sidebar-nav.tsx`

**Design spec:**
```
Outer: full viewport, bg #1B59E8
Inner card: white, rounded-3xl, m-3, min-h-[calc(100vh-24px)], flex-col
Top bar: flex items-center px-6 h-14 border-b border-border
  Left: [Logo] [›collapse] [Page title bold]
  Right: [🔔 bell] [Avatar] [Name] [email] [chevron]
Sidebar: w-16 (collapsed) | w-56 (expanded), border-r, transition-all
  Each nav item: flex items-center gap-3 px-4 py-2.5 rounded-lg
  Active: bg-primary/10 text-primary border-l-4 border-primary
  Icon: 20px, text-muted-foreground (inactive) | text-primary (active)
Content: flex-1 overflow-y-auto p-6

Responsive:
  Mobile (<768px):  sidebar hidden, hamburger button in top bar opens Sheet drawer
  Tablet (768px):   sidebar always icon-only (w-16), no toggle
  Desktop (>1024px): sidebar toggles between w-16 and w-56
  Top bar mobile: show only Logo + hamburger + bell, hide name/email
```

> Use **shadcn MCP** to add Sheet component for mobile drawer.
> Use **Chrome DevTools MCP** to verify layout at each breakpoint after implementation.

**Step 1: Write test for sidebar collapse**
```typescript
// tests/unit/components/sidebar.test.tsx
import { render, fireEvent } from '@testing-library/react'
import { Sidebar } from '~/components/shell/sidebar'

it('toggles collapsed state', () => {
  const { getByRole } = render(<Sidebar items={[]} />)
  const toggle = getByRole('button', { name: /collapse/i })
  fireEvent.click(toggle)
  // sidebar collapses — label text hidden
})
```

**Step 2: Run to verify red**

**Step 3: Implement using frontend-design skill**

**Step 4: Run tests**

**Step 5: Commit**
```bash
git commit -m "feat(shell): add app shell with collapsible sidebar nav"
```

---

### Task 1.10: Biome + Husky + commitlint + Jest + Playwright config

**Files:**
- Verify `biome.json` has ultracite config
- Verify `.husky/pre-commit` runs Biome
- Create `jest.config.ts`
- Create `playwright.config.ts`

**Step 1: Configure Jest**
```typescript
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/app/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {}],
  },
  testMatch: ['<rootDir>/tests/unit/**/*.test.{ts,tsx}'],
}

export default config
```

**Step 2: Configure Playwright**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    // Desktop
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    // Tablet
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    // Mobile
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone SE'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Step 3: Verify all hooks run**
```bash
pnpm check          # Biome
pnpm test           # Jest
echo "chore: test" | pnpm commitlint  # Commitlint
```

**Step 4: Commit**
```bash
git commit -m "chore(tooling): configure jest, playwright, biome and husky"
```

---

### Task 1.10: Sentry setup + error boundaries

**Files:**
- Modify: `app/root.tsx`
- Create: `app/lib/monitoring/sentry.ts`
- Create: `app/components/error-boundary.tsx`

> Use **context7 MCP** to look up `@sentry/tanstackstart-react` integration API.
> Use **Vercel MCP** to add `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` env vars.

**Step 1: Install Sentry**
```bash
pnpm add @sentry/tanstackstart-react
```

**Step 2: Write failing test**
```typescript
// tests/unit/sentry.test.ts
import { describe, it, expect, vi } from '@jest/globals'
import * as Sentry from '@sentry/tanstackstart-react'

describe('Sentry integration', () => {
  it('captureException sends an error', () => {
    const spy = vi.spyOn(Sentry, 'captureException').mockImplementation(() => '')
    const err = new Error('test')
    Sentry.captureException(err)
    expect(spy).toHaveBeenCalledWith(err)
  })
})
```

**Step 3: Run to verify red**
```bash
pnpm test tests/unit/sentry.test.ts
```
Expected: FAIL — Sentry not configured.

**Step 4: Implement Sentry init**
```typescript
// app/lib/monitoring/sentry.ts
import * as Sentry from '@sentry/tanstackstart-react'

export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    integrations: [Sentry.tanstackRouterBrowserTracingIntegration()],
  })
}
```

**Step 5: Add error boundary component**
```tsx
// app/components/error-boundary.tsx
import { Component, type ReactNode } from 'react'
import * as Sentry from '@sentry/tanstackstart-react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <p className="text-lg font-semibold text-text">Something went wrong</p>
            <button className="mt-4 text-primary underline" onClick={() => this.setState({ hasError: false })}>
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
```

**Step 6: Wire into root**

In `app/root.tsx`:
- Call `initSentry()` at module level (client only)
- Wrap `<Outlet />` with `<ErrorBoundary>`

**Step 7: Run tests green**
```bash
pnpm test tests/unit/sentry.test.ts
```

**Step 8: Commit**
```bash
git add app/lib/monitoring/sentry.ts app/components/error-boundary.tsx app/root.tsx
git commit -m "feat(monitoring): add Sentry init and error boundary"
```

---

## M2 · Marketing Site

> Use `frontend-design` skill for every page in this milestone.
> **Responsive check required on every task:** verify at 375px, 768px, 1440px using **Chrome DevTools MCP** or **Playwright MCP** before committing.
> Nav collapses to hamburger on mobile. Hero stacks vertically on mobile. Feature grids: 1-col mobile → 2-col tablet → 4-col desktop.

### Task 2.1: Marketing layout (nav + footer)

**Files:**
- Create: `app/routes/($locale)/(marketing)/_layout.tsx`
- Create: `app/components/marketing/nav.tsx`
- Create: `app/components/marketing/footer.tsx`

**Nav design (from Keyturn):**
```
Logo left | Solutions  How it works  About  (center) | Login  Get started (right, blue pill)
Bg: white, sticky top, border-b on scroll
```

**Footer design:**
```
4 columns: Logo+tagline+social | Product | Company | Newsletter subscribe
Bottom row: © · Privacy · Terms
Bg: #f8f9fa
```

**Step 1: Write test**
```typescript
// tests/unit/components/nav.test.tsx
import { render } from '@testing-library/react'
import { MarketingNav } from '~/components/marketing/nav'

it('renders login and get started links', () => {
  const { getByRole } = render(<MarketingNav locale="en" />)
  expect(getByRole('link', { name: /login/i })).toBeDefined()
  expect(getByRole('link', { name: /get started/i })).toBeDefined()
})
```

**Step 2: Implement using frontend-design skill**

**Step 3: Commit**
```bash
git commit -m "feat(marketing): add nav and footer components"
```

---

### Task 2.2: Landing page

> **Design refs:** `design-images/35293a...a04ad.png` and `design-images/35293a169315941(1)...png` — full landing page wireframe with all 10 sections; `design-images/5bee51...png` and `design-images/8dc055...png` — hero with catalog preview screenshot

**Files:**
- Create: `app/routes/($locale)/index.tsx`
- Create: `app/components/marketing/hero.tsx`
- Create: `app/components/marketing/stats-bar.tsx`
- Create: `app/components/marketing/features-grid.tsx`
- Create: `app/components/marketing/feature-section.tsx`
- Create: `app/components/marketing/cta-banner.tsx`
- Create: `app/components/marketing/advantage-cards.tsx`
- Create: `app/components/marketing/email-cta.tsx`

**Sections (top to bottom, Keyturn-mapped):**
1. `<Hero>` — Left: H1 "Investing in Bulgarian real estate has never been **easier**." + sub + email input + "Get access" blue pill. Right: floating dashboard screenshot mockup
2. `<StatsBar>` — 4 stats: €Xm invested · X investors · X.X% avg IRR · X projects
3. `<FeaturesGrid>` — 4 cards (Discover, Analyze, Invest, Track). First card highlighted blue
4. Feature sections (alternating): Browse projects | Analyze returns | Invest securely | Track progress
5. `<CtaBanner>` — Full blue bg, geometric shapes, "Thinking about investing? Book a call"
6. `<AdvantageCards>` — 3 cards: Find the best projects · Maximize returns · Save time
7. `<EmailCta>` — Full blue bg, "Looking for investment opportunities?" + email + Sign Up
8. Footer

**Step 1: Write E2E smoke test**
```typescript
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test'

test('landing page loads with hero CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: /get started/i })).toBeVisible()
})

test('/bg/ shows Bulgarian content', async ({ page }) => {
  await page.goto('/bg')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
```

**Step 2: Implement using frontend-design skill**

**Step 3: Run E2E**
```bash
pnpm playwright test tests/e2e/landing.spec.ts
```

**Step 4: Commit**
```bash
git commit -m "feat(marketing): add landing page with all Keyturn-inspired sections"
```

---

### Task 2.3: How it works page

**Files:**
- Create: `app/routes/($locale)/how-it-works.tsx`
- Create: `app/components/marketing/how-it-works-steps.tsx`

**Design:** Numbered steps (1 Register → 2 Browse → 3 Invest → 4 Earn). Each step: icon + heading + description. Alternating image blocks.

**Step 1: E2E test**
```typescript
// tests/e2e/how-it-works.spec.ts
test('how it works page renders 4 steps', async ({ page }) => {
  await page.goto('/how-it-works')
  const steps = page.locator('[data-testid="step"]')
  await expect(steps).toHaveCount(4)
})
```

**Step 2: Implement + commit**
```bash
git commit -m "feat(marketing): add how-it-works page"
```

---

### Task 2.4: About page

**Files:**
- Create: `app/routes/($locale)/about.tsx`

**Design:** Mission statement + team section + values cards.

**Step 1: Implement + test + commit**
```bash
git commit -m "feat(marketing): add about page"
```

---

## M3 · Auth Pages

> Use `frontend-design` skill. Use `tdd` skill for form validation logic.
> Auth pages are standalone (no sidebar). Centered card layout. Full-width on mobile (no card border-radius below 480px).

### Task 3.1: Login page

**Files:**
- Create: `app/routes/($locale)/login.tsx`
- Create: `app/components/auth/login-form.tsx`

**Design (Keyturn — standalone, no sidebar):**
```
Logo top-left
Centered card (max-w-md):
  "Welcome back" heading
  Email input
  Password input + show/hide toggle
  "Forgot password?" link (right-aligned)
  "Sign in" blue full-width button
  Divider
  "Don't have an account? Register"
```

**Step 1: Write form validation test**
```typescript
// tests/unit/components/login-form.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '~/components/auth/login-form'

it('shows email error when invalid email submitted', async () => {
  const { getByLabelText, getByRole, findByText } = render(
    <LoginForm onSubmit={vi.fn()} />
  )
  fireEvent.change(getByLabelText(/email/i), { target: { value: 'notanemail' } })
  fireEvent.click(getByRole('button', { name: /sign in/i }))
  await findByText(/valid email/i)
})

it('shows password error when too short', async () => {
  const { getByLabelText, getByRole, findByText } = render(
    <LoginForm onSubmit={vi.fn()} />
  )
  fireEvent.change(getByLabelText(/password/i), { target: { value: '123' } })
  fireEvent.click(getByRole('button', { name: /sign in/i }))
  await findByText(/at least 6/i)
})
```

**Step 2: Run to verify red**

**Step 3: Implement using frontend-design + TanStack Form + Zod**

Zod schema:
```typescript
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
```

Route `loader`: if already authenticated, redirect to `/dashboard`.
Route `action`: call `loginAction` server fn, redirect on success.

**Step 4: E2E test**
```typescript
// tests/e2e/auth.spec.ts
test('login redirects to dashboard on success', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type=email]', process.env.TEST_USER_EMAIL!)
  await page.fill('input[type=password]', process.env.TEST_USER_PASSWORD!)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/dashboard/)
})
```

**Step 5: Commit**
```bash
git commit -m "feat(auth): add login page with TanStack Form validation"
```

---

### Task 3.2: Register page

**Files:**
- Create: `app/routes/($locale)/register.tsx`
- Create: `app/components/auth/register-form.tsx`

**Design:** Same standalone style. Fields: First name, Last name, Email, Password, Confirm password. "Create account" blue button.

**Step 1: Write test (confirm password validation)**
```typescript
it('shows error when passwords do not match', async () => {
  // ...
})
```

**Step 2: Implement + test + commit**
```bash
git commit -m "feat(auth): add register page"
```

---

### Task 3.3: Forgot password page

**Files:**
- Create: `app/routes/($locale)/forgot-password.tsx`

**Step 1: Implement + test + commit**
```bash
git commit -m "feat(auth): add forgot password page"
```

---

## M4 · Public Project Pages

> Use `frontend-design` skill. Use `tdd` for data-fetching logic.
> Use **Supabase MCP** to run queries and verify RLS policies on projects table.
> Project catalog: 1-col mobile → 2-col tablet → 4-col desktop. Filters collapse into a drawer on mobile.
> Project detail: single-column stacked on mobile, 2-col grid on desktop.

### Task 4.1: Project server functions

**Files:**
- Create: `app/server/projects.ts`
- Test: `tests/unit/server/projects.test.ts`

**Step 1: Write failing tests**
```typescript
// tests/unit/server/projects.test.ts
const mockSelect = vi.fn().mockReturnThis()
const mockEq = vi.fn().mockReturnThis()
const mockIn = vi.fn().mockResolvedValue({ data: [], error: null })

vi.mock('~/lib/supabase/server', () => ({
  createSupabaseServerClient: () => ({ from: () => ({ select: mockSelect, eq: mockEq, in: mockIn }) })
}))

describe('getPublishedProjects', () => {
  it('queries only fundraising/funded/in_execution status', async () => {
    const { getPublishedProjects } = require('~/server/projects')
    await getPublishedProjects({ locale: 'en', search: '', strategy: 'all', sort: 'featured' })
    expect(mockIn).toHaveBeenCalledWith('status', ['fundraising', 'funded', 'in_execution', 'exiting', 'completed'])
  })
})
```

**Step 2: Run to verify red**

**Step 3: Implement**
```typescript
// app/server/projects.ts
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'
import { createSupabaseServerClient } from '~/lib/supabase/server'

const catalogSchema = z.object({
  locale: z.enum(['en', 'bg']),
  search: z.string().default(''),
  strategy: z.string().default('all'),
  sort: z.enum(['featured', 'funded_desc', 'irr_desc']).default('featured'),
  page: z.number().default(1),
})

export const getPublishedProjects = createServerFn({ method: 'GET' })
  .validator(catalogSchema)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient()
    let query = supabase
      .from('projects')
      .select(`
        id, slug, title_bg, title_en, description_bg, description_en,
        strategy, status, city, district, property_type,
        target_amount, min_investment, funded_amount, investor_count,
        projected_irr_min, projected_irr_max, projected_roi_min, projected_roi_max,
        fundraise_start, fundraise_end, cover_images, risk_score,
        estimated_duration_months, currency
      `)
      .in('status', ['fundraising', 'funded', 'in_execution', 'exiting', 'completed'])

    if (data.search) {
      query = query.or(`title_en.ilike.%${data.search}%,title_bg.ilike.%${data.search}%,city.ilike.%${data.search}%`)
    }
    if (data.strategy !== 'all') {
      query = query.eq('strategy', data.strategy)
    }

    const { data: projects, error } = await query
    if (error) throw new Error(error.message)

    return projects?.map(p => ({
      ...p,
      title: data.locale === 'bg' ? p.title_bg : p.title_en,
      description: data.locale === 'bg' ? p.description_bg : p.description_en,
      fundedPct: p.target_amount > 0 ? Math.round((p.funded_amount / p.target_amount) * 100) : 0,
    })) ?? []
  })

export const getProjectBySlug = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string(), locale: z.enum(['en', 'bg']) }))
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient()
    const { data: project, error } = await supabase
      .from('projects')
      .select(`*, milestones(*), documents(id, title, category, is_public)`)
      .eq('slug', data.slug)
      .in('status', ['fundraising', 'funded', 'in_execution', 'exiting', 'completed'])
      .maybeSingle()

    if (error || !project) return null
    return {
      ...project,
      title: data.locale === 'bg' ? project.title_bg : project.title_en,
      description: data.locale === 'bg' ? project.description_bg : project.description_en,
      fundedPct: project.target_amount > 0
        ? Math.round((project.funded_amount / project.target_amount) * 100) : 0,
    }
  })
```

**Step 4: Run tests**

**Step 5: Commit**
```bash
git commit -m "feat(projects): add getPublishedProjects and getProjectBySlug server functions"
```

---

### Task 4.2: Project catalog page

> **Design refs:** `design-images/5dc528...a4469.png` — catalog list+map view, filter panel, sort bar, property card grid

**Files:**
- Create: `app/routes/($locale)/projects/index.tsx`
- Create: `app/components/projects/project-card.tsx`
- Create: `app/components/projects/project-filter-bar.tsx`
- Create: `app/components/projects/project-grid.tsx`
- Create: `app/components/projects/filter-drawer.tsx`

**Design (Keyturn "Find properties"):**
- Search bar full-width + blue "Search" button + "Save search" outlined
- Sort dropdown + Filter button (opens right drawer)
- Active filter chips with × remove
- "Viewing X of Y projects" count
- 4-column card grid (2-col on tablet, 1-col on mobile)
- Map toggle button (top-right of grid) — shows/hides split map view

**Property card (Keyturn-mapped for investments):**
```
[Photo]               [♥ bookmark]
[FUNDED XX% badge]
€TARGET_AMOUNT        Listed X days ago
Strategy · City · Property type
District, Bulgaria
────────────────────────────
Min. investment   IRR            Duration
€X,XXX            X–X%           X months
Funded            Risk score
XX%  [progress]   ★★★☆☆
```

**Filter drawer fields:**
- Investment amount: range slider (€100 – €50,000)
- IRR: min input
- Strategy: single family / flip / buy_to_rent / development
- Status: fundraising / funded / in_execution
- City: text input
- Duration: max months

**Step 1: Write test**
```typescript
// tests/unit/components/project-card.test.tsx
import { render } from '@testing-library/react'
import { ProjectCard } from '~/components/projects/project-card'

const mockProject = {
  id: '1', slug: 'test', title: 'Test Project', city: 'Sofia',
  strategy: 'flip', fundedPct: 65, min_investment: 500,
  projected_irr_min: 8, projected_irr_max: 12,
  target_amount: 100000, funded_amount: 65000, investor_count: 24,
  estimated_duration_months: 18, cover_images: [],
}

it('renders project title and funded percentage', () => {
  const { getByText } = render(<ProjectCard project={mockProject} locale="en" />)
  expect(getByText('Test Project')).toBeDefined()
  expect(getByText(/65%/)).toBeDefined()
})
```

**Step 2: Run to verify red**

**Step 3: Implement using frontend-design skill**

TanStack Query for data:
```typescript
// In the route component
const { data: projects } = useSuspenseQuery({
  queryKey: ['projects', searchParams],
  queryFn: () => getPublishedProjects(searchParams),
})
```

**Step 4: E2E test**
```typescript
// tests/e2e/projects.spec.ts
test('project catalog shows project cards', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.locator('[data-testid="project-card"]').first()).toBeVisible()
})

test('filter by strategy filters results', async ({ page }) => {
  await page.goto('/projects')
  await page.click('[data-testid="filter-button"]')
  await page.click('[data-testid="strategy-flip"]')
  await page.click('[data-testid="apply-filters"]')
  // results update
})
```

**Step 5: Commit**
```bash
git commit -m "feat(projects): add project catalog with filter, sort and grid"
```

---

### Task 4.3: Project detail page (public)

> **Design refs:** `design-images/faf442...a1378.png` (top section — image + financial snapshot panel) and `design-images/051a85...a6974.png` (full scroll — calculator, financials table, visualize returns chart)

**Files:**
- Create: `app/routes/($locale)/projects/$slug/index.tsx`
- Create: `app/components/projects/project-gallery.tsx`
- Create: `app/components/projects/financial-snapshot.tsx`
- Create: `app/components/projects/investment-calculator.tsx`
- Create: `app/components/projects/returns-chart.tsx`
- Create: `app/components/projects/detailed-financials-table.tsx`

**Design (Keyturn property detail — exactly):**
```
[← Back to projects]            [Invest Now (blue)] [Save ♥]

Left col (55%):                 Right col (45%):
  Photo gallery                   "Financial snapshot"
  [01 ─── 03] slide dots          [1yr] 5yr exit (tab toggle, blue active)
                                  ─────────────────────
  Title + City                    Key metrics (label right-aligned value):
  Strategy badge + Status pill    Min. investment    €X,XXX
                                  Target IRR         X–X%
  Bedrooms · Bathrooms · SQM      Duration           X months
  Property type · Year built      Funded             XX%
                                  Investors          XXX
                                  ─────────────────────
                                  In-project stats
                                  [3 stat cards]
                                  ─────────────────────
                                  IRR projection [bar chart]

Below fold — full width:
  Calculator (left) | CTAs + Map (right)
  ─────────────────────────────────────
  Detailed financials table
  [PROJECTED RETURNS] [OTHER FINANCIALS] tab
  Columns: 1yr · 3yr · 5yr · exit
  Rows: Cumulative return · Capital returned · IRR
  ─────────────────────────────────────
  Visualize the returns
  [Stacked bar + line, exit-year projection]
```

**Step 1: Write test**
```typescript
test('financial snapshot shows IRR and min investment', () => {
  const { getByText } = render(
    <FinancialSnapshot project={mockProject} locale="en" />
  )
  expect(getByText(/8.*12%/)).toBeDefined()
  expect(getByText('€500')).toBeDefined()
})
```

**Step 2: Implement using frontend-design skill**

**Step 3: E2E test**
```typescript
test('project detail page renders financial snapshot', async ({ page }) => {
  await page.goto('/projects/test-project-slug')
  await expect(page.getByText('Financial snapshot')).toBeVisible()
  await expect(page.getByRole('link', { name: /invest now/i })).toBeVisible()
})
```

**Step 4: Commit**
```bash
git commit -m "feat(projects): add project detail page with financial snapshot and charts"
```

---

## M5 · Investment Flow + Stripe

> Use **Stripe MCP** to inspect products, test webhooks, and verify payment intents during development.
> Use **context7 MCP** for TanStack Start `createAPIFileRoute` webhook pattern.
> Checkout page: standalone (no sidebar), stacked on mobile (summary above payment form), 2-col on desktop.

### Task 5.1: Stripe server functions

**Files:**
- Create: `app/server/investments.ts`
- Create: `app/lib/stripe/client.ts`
- Test: `tests/unit/server/investments.test.ts`

**Step 1: Write failing tests**
```typescript
describe('createInvestmentCheckout', () => {
  it('throws when amount below project minimum', async () => {
    const { createInvestmentCheckout } = require('~/server/investments')
    await expect(
      createInvestmentCheckout({ projectId: '1', amount: 50, locale: 'en' })
    ).rejects.toThrow(/below minimum/)
  })

  it('throws when amount above project maximum', async () => {
    // ...
  })
})
```

**Step 2: Implement**
```typescript
// app/server/investments.ts
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'
import { redirect } from '@tanstack/react-router'
import Stripe from 'stripe'
import { getRuntimeEnv } from '~/env'
import { createSupabaseServerClient } from '~/lib/supabase/server'
import { requireAuth } from '~/lib/auth/guards'

const checkoutSchema = z.object({
  projectId: z.string().uuid(),
  amount: z.number().positive(),
  locale: z.enum(['en', 'bg']),
})

export const createInvestmentCheckout = createServerFn({ method: 'POST' })
  .validator(checkoutSchema)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    requireAuth(user, data.locale)

    // Fetch project limits
    const { data: project } = await supabase
      .from('projects')
      .select('id, slug, title_en, min_investment, max_investment, target_amount, funded_amount, status, currency')
      .eq('id', data.projectId)
      .single()

    if (!project || project.status !== 'fundraising') throw new Error('Project not available for investment')
    if (data.amount < project.min_investment) throw new Error(`Amount below minimum of ${project.min_investment}`)
    if (project.max_investment && data.amount > project.max_investment) throw new Error('Amount above maximum')

    const env = getRuntimeEnv()
    const stripe = new Stripe(env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: project.currency.toLowerCase(),
          product_data: { name: project.title_en },
          unit_amount: Math.round(data.amount * 100),
        },
        quantity: 1,
      }],
      metadata: { projectId: data.projectId, userId: user!.id, amount: data.amount.toString() },
      success_url: `${env.NEXT_PUBLIC_APP_URL}/projects/${project.slug}/invest/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/projects/${project.slug}/invest`,
    })

    throw redirect({ href: session.url! })
  })
```

**Step 3: Stripe webhook handler**
```typescript
// app/api/webhooks/stripe.ts (TanStack Start API route)
import { createAPIFileRoute } from '@tanstack/start/api'
import Stripe from 'stripe'
import { createSupabaseAdminClient } from '~/lib/supabase/admin'
import { getRuntimeEnv } from '~/env'

export const APIRoute = createAPIFileRoute('/api/webhooks/stripe')({
  POST: async ({ request }) => {
    const env = getRuntimeEnv()
    const stripe = new Stripe(env.STRIPE_SECRET_KEY)
    const sig = request.headers.get('stripe-signature')!
    const body = await request.text()

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET)
    } catch {
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.CheckoutSession
      const { projectId, userId, amount } = session.metadata!

      const supabase = createSupabaseAdminClient()
      // Create investment record
      await supabase.from('investments').insert({
        investor_id: userId,
        project_id: projectId,
        amount: parseFloat(amount),
        status: 'active',
        stripe_payment_intent_id: session.payment_intent as string,
        paid_at: new Date().toISOString(),
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
      })
    }

    return new Response('ok', { status: 200 })
  },
})
```

**Step 4: Commit**
```bash
git commit -m "feat(stripe): add investment checkout and webhook handler"
```

---

### Task 5.2: Checkout page

> **Design ref:** `design-images/67cbfb...9b2b4.png` — left: payment method list (radio, expands to card form, Apple Pay, Google Pay, PayPal); right: light-blue `#CEE8FB` billing summary card with project thumbnail + metrics + total + blue Checkout button

**Files:**
- Create: `app/routes/($locale)/projects/$slug/invest/index.tsx`
- Create: `app/components/invest/amount-selector.tsx`
- Create: `app/components/invest/billing-summary.tsx`

**Design (Keyturn checkout):**
```
Logo top-left (standalone, no sidebar)

Left col:
  "Investment amount"
  Slider: min_investment → max_investment (or remaining)
  Preset buttons: min · mid · max
  Manual input field (€)
  Terms checkbox + link

Right col (light blue bg):
  "Investment Summary"
  [Project thumbnail] [Title] [City]
  Min. investment: €X,XXX
  IRR: X–X%
  ─────────────────
  Amount:     €X,XXX
  Platform fee: €XX (X%)
  ─────────────────
  Total:      €X,XXX
  [Complete Investment] blue full-width button

← Back to project detail
```

**Step 1: Test amount validation**
```typescript
it('disables submit when amount below minimum', () => {
  // ...
})
```

**Step 2: Implement using frontend-design skill**

**Step 3: E2E test**
```typescript
test('invest checkout redirects unauthenticated to login', async ({ page }) => {
  await page.goto('/projects/test-slug/invest')
  await expect(page).toHaveURL(/\/login/)
})
```

**Step 4: Commit**
```bash
git commit -m "feat(invest): add investment checkout page with amount selector"
```

---

### Task 5.3: Investment success page

**Files:**
- Create: `app/routes/($locale)/projects/$slug/invest/success.tsx`

**Design:** Keyturn success — centered, logo top, light blue badge icon, "Your investment was successful!", "Go to dashboard" blue pill.

**Step 1: Implement + test + commit**
```bash
git commit -m "feat(invest): add investment success page"
```

---

## M6 · Investor Dashboard

> Use `frontend-design` skill for all pages. Use **Supabase MCP** to verify data and RLS.
> Use **Chrome DevTools MCP** to check console errors after each page.
> Dashboard: KPI cards stack 1-col on mobile → 2-col tablet → 4-col desktop.
> Tables: horizontal scroll on mobile. Charts: full-width, simplified legend on mobile.

### Task 6.1: Dashboard layout + shell

**Files:**
- Create: `app/routes/($locale)/dashboard/_layout.tsx`
- Reuse: `app/components/shell/app-shell.tsx`
- Reuse: `app/components/shell/sidebar.tsx`

**Dashboard sidebar nav items:**
| Icon | Label | Route |
|------|-------|-------|
| Search | Browse projects | /projects |
| List | My investments | /dashboard/investments |
| Chart | Portfolio | /dashboard/portfolio |
| Bell | Notifications (+ badge) | /dashboard/notifications |
| House | Favorites | /dashboard/favorites |
| Gear | Settings | /dashboard/settings |
| ? | Help | — |
| Arrow-out | Log out | — |

`_layout.tsx` beforeLoad: call `getSessionUser()`, call `requireAuth()`, call `getSessionProfile()` for role. Pass user + profile in context.

**Step 1: Write guard test**
```typescript
test('dashboard redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})
```

**Step 2: Implement**

**Step 3: Commit**
```bash
git commit -m "feat(dashboard): add protected dashboard layout with sidebar"
```

---

### Task 6.2: Dashboard overview page

**Files:**
- Create: `app/routes/($locale)/dashboard/index.tsx`
- Create: `app/server/dashboard.ts` (summary data)
- Create: `app/components/dashboard/kpi-card.tsx`
- Create: `app/components/dashboard/quick-links.tsx`

**Design:**
```
"Welcome back, [Name]"
────────────────────────────────────
[4 KPI cards in a row]:
  Active investments   Total invested   Total returned   Portfolio IRR
  X                    €XX,XXX          €X,XXX           X.X%
────────────────────────────────────
Quick links row: [Browse projects] [Portfolio] [Wallet] [Documents]
────────────────────────────────────
Recent activity feed (last 5 investments/distributions)
```

**Step 1: Write test**
```typescript
describe('fetchDashboardSummary', () => {
  it('returns zero values for new investor', async () => {
    // mock supabase returning empty investments
    const result = await fetchDashboardSummary('user-id')
    expect(result.activeInvestments).toBe(0)
    expect(result.totalInvested).toBe(0)
  })
})
```

**Step 2: Implement server function**
```typescript
// app/server/dashboard.ts
export const getDashboardSummary = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthenticated')

    const { data: investments } = await supabase
      .from('investments')
      .select('amount, total_returned, status')
      .eq('investor_id', user.id)
      .in('status', ['active', 'returning', 'exited'])

    const active = investments?.filter(i => i.status === 'active').length ?? 0
    const totalInvested = investments?.reduce((sum, i) => sum + i.amount, 0) ?? 0
    const totalReturned = investments?.reduce((sum, i) => sum + i.total_returned, 0) ?? 0

    return { activeInvestments: active, totalInvested, totalReturned, netExposure: totalInvested - totalReturned }
  })
```

**Step 3: Implement page using frontend-design skill**

**Step 4: Commit**
```bash
git commit -m "feat(dashboard): add overview page with KPI cards"
```

---

### Task 6.3–6.13: Remaining dashboard pages

Follow the same TDD pattern for each. Use `frontend-design` skill for UI.

**6.3 — My Investments (`/dashboard/investments`)**
- Query: `investments` joined with `projects`
- Design: Keyturn "Your deals" — 4-col project cards, sort/filter bar (see `8dc055...png`, `5bee51...png` — card grid)
- Server fn: `getMyInvestments()`
- Card shows: project photo, funded %, invested amount, status pill, IRR, distributions received

**6.4 — Portfolio (`/dashboard/portfolio`)**
- Charts (Recharts): allocation pie, returns over time area, IRR by project bar
- Server fn: `getPortfolioAnalytics()`
- Design: see `bbc941...a2270.png` — financial snapshot, in-year stats, seasonalized revenue bar chart, detailed financials table, visualize returns stacked chart

**6.5 — Wallet (`/dashboard/wallet`)**
- Balance card (large, prominent)
- Server fn: `getWalletBalance()` using `account_balances` view
- Transaction history table (last 20)
- Deposit/Withdraw buttons (future feature — placeholder CTAs)

**6.6 — Transactions (`/dashboard/transactions`)**
- Full table: Type · Amount · Date · Reference · Status
- Server fn: `getMyTransactions()`
- Filters: type, date range

**6.7 — Distributions (`/dashboard/distributions`)**
- Table: Project · Type · Gross · Net · Date · Status
- Server fn: `getMyDistributions()`

**6.8 — Favorites (`/dashboard/favorites`)**
- Design: `f5aac4...a57d1.png` — saved search rows, each row expands to mini property cards
- Server fn: `getFavorites()`, `toggleFavorite()`

**6.9 — Progress updates (`/dashboard/progress`)**
- Timeline feed of published progress updates for invested projects
- Photos, videos, budget status, timeline status
- Server fn: `getProgressUpdates()`

**6.10 — Documents (`/dashboard/documents`)**
- Grouped by category
- Download links (Supabase Storage signed URLs)
- Server fn: `getMyDocuments()`

**6.11 — Notifications (`/dashboard/notifications`)**
- Design: `0371e3...9d1d7.png` — inbox list (left), conversation thread (center), notifications panel (right)
- List with read/unread state, mark all as read
- Server fn: `getNotifications()`, `markAsRead()`

**6.12 — KYC (`/dashboard/kyc`)**
- Status card (not_started / pending / approved / rejected)
- Sumsub WebSDK embed for verification flow
- Server fn: `getKycStatus()`, `createSumsubToken()`

**6.13 — Settings (`/dashboard/settings`)**
- Design: `f3512a...a32d0.png` — tabs: Profile / Password / Billing / Plans / Notifications; Help page with category cards + FAQ accordion
- Tabs for our app: Profile / Password / Notifications (billing handled via Stripe portal)
- Server fns: `updateProfile()`, `updatePassword()`, `updateNotificationPreferences()`

**6.14 — Statements (`/dashboard/statements`)**
- Monthly statement list, download as PDF
- Server fn: `getStatements()`

**6.15 — Invested project detail (`/dashboard/projects/$slug`)**
- Investor-only view: full financial data, actual vs projected, documents tab

For each page above:
```bash
# Pattern:
git commit -m "feat(dashboard): add [page name] page"
```

---

## M7 · Admin Panel

> Admin sidebar adds: Projects, Investors, Investments, Budget, Contractors, Documents, Audit, Metrics.
> Use **Supabase MCP** for all DB operations and admin-level queries.
> Use **Vercel MCP** to check preview deploy for each major admin page.
> Admin tables: sortable, paginated, horizontal scroll on mobile. Forms: single-column stacked on mobile.

### Task 7.1: Admin layout

**Files:**
- Create: `app/routes/($locale)/admin/_layout.tsx`

`beforeLoad`: `getSessionProfile()` → `requireAdmin()`. Admin sidebar nav items.

**Step 1: Write guard test**
```typescript
test('admin redirects investor to dashboard', async ({ page }) => {
  // login as investor role, navigate to /admin/dashboard
  await expect(page).toHaveURL(/\/dashboard/)
})
```

**Step 2: Implement + commit**
```bash
git commit -m "feat(admin): add protected admin layout with role guard"
```

---

### Task 7.2–7.12: Admin pages

Follow TDD pattern for all server functions. Use `frontend-design` for all UI.

**7.2 — Admin dashboard (`/admin/dashboard`)**
- KPIs: Total AUM, Active investors, Active projects, Total distributions paid
- Charts: New investors/month, AUM growth, Project status pipeline

**7.3 — Projects list (`/admin/projects`)**
- Full table: Title, Status pill, Strategy, City, Target, Funded %, Investors, Created
- Status pipeline filter tabs: Draft / In Review / Approved / Fundraising / Funded / In Execution / Completed
- "New project" blue button → `/admin/projects/new`

**7.4 — Create project (`/admin/projects/new`)**
- Multi-step form (Steps: Basic info → Location → Financials → Timeline → SPV → Images)
- TanStack Form + Zod, `createProject()` server fn

**7.5 — Edit project (`/admin/projects/:id`)**
- Same form pre-filled
- Tabs: Info / Budget / Milestones / Documents / Contractors / Progress updates / Cap table
- Status transition buttons (Draft → In Review → Approved → Fundraising)

**7.6 — Investors list (`/admin/investors`)**
- Table: Name, Email, KYC status, Total invested, Investments count, Joined
- KYC status filter

**7.7 — Investor detail (`/admin/investors/:id`)**
- Profile card + investments table + documents + KYC status + actions

**7.8 — Cap table (`/admin/investments`)**
- Per-project selector
- Table: Investor, Amount, Ownership %, Status, IRR, Distributions, Invested at

**7.9 — Budget (`/admin/budget`)**
- Per-project selector
- CAPEX/OPEX table: Category, Description, Planned, Actual, Vendor, Status
- Totals row, over/under budget indicator

**7.10 — Contractors (`/admin/contractors`)**
- Table + CRUD modals

**7.11 — Documents (`/admin/documents`)**
- Upload + manage per project

**7.12 — Audit log (`/admin/audit`)**
- Immutable table: Table, Record ID, Action, Changed by, Timestamp, Changes diff

**7.13 — Metrics (`/admin/metrics`)**
- Platform-wide charts: AUM over time, new investors by month, IRR distribution, geographic map

For each page:
```bash
git commit -m "feat(admin): add [page name] page"
```

---

## M8 · KYC + Emails + Realtime

### Task 8.1: Sumsub KYC integration

**Files:**
- Create: `app/server/kyc.ts`
- Create: `app/api/webhooks/sumsub.ts`
- Create: `app/components/kyc/sumsub-widget.tsx`

**Step 1: Write test for HMAC signature**
```typescript
describe('verifySumsubWebhook', () => {
  it('returns true when signature matches', () => {
    const { verifySumsubSignature } = require('~/server/kyc')
    // test with known payload + signature
  })
})
```

**Step 2: Implement `createSumsubToken` server fn and webhook handler**

**Step 3: Commit**
```bash
git commit -m "feat(kyc): add Sumsub integration with token generation and webhook"
```

---

### Task 8.2: Resend email notifications

**Files:**
- Create: `app/lib/email/templates/` (investment-confirmed, distribution-paid, kyc-approved, welcome)
- Create: `app/server/notifications.ts`

**Step 1: Test email template renders**
```typescript
it('investment confirmed email contains amount', async () => {
  const html = await renderInvestmentConfirmedEmail({ amount: 1000, projectTitle: 'Test' })
  expect(html).toContain('€1,000')
})
```

**Step 2: Implement templates with @react-email/components**

**Step 3: Wire into Stripe webhook and Sumsub webhook handlers**

**Step 4: Commit**
```bash
git commit -m "feat(email): add Resend email notifications for investment and KYC events"
```

---

### Task 8.3: Supabase Realtime

**Files:**
- Create: `app/hooks/use-funding-progress.ts`
- Create: `app/hooks/use-notifications.ts`

**Real-time subscriptions:**
- Funding progress bar on project detail → subscribes to `projects` table changes for `funded_amount`
- Notification bell badge → subscribes to `notifications` for unread count

```typescript
// app/hooks/use-funding-progress.ts
import { useEffect, useState } from 'react'
import { createBrowserClient } from '~/lib/supabase/client'

export function useFundingProgress(projectId: string, initialPct: number) {
  const [pct, setPct] = useState(initialPct)
  useEffect(() => {
    const supabase = createBrowserClient()
    const channel = supabase
      .channel(`project-${projectId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'projects',
        filter: `id=eq.${projectId}`,
      }, (payload) => {
        const p = payload.new as { funded_amount: number; target_amount: number }
        setPct(Math.round((p.funded_amount / p.target_amount) * 100))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [projectId])
  return pct
}
```

**Step 1: Test hook**

**Step 2: Implement + wire into project detail and notification bell**

**Step 3: Commit**
```bash
git commit -m "feat(realtime): add Supabase Realtime for funding progress and notifications"
```

---

## M9 · Polish + Launch

> Use **Playwright MCP** for all E2E and responsive testing.
> Use **Vercel MCP** to deploy final production build and verify logs.
> Use **Chrome DevTools MCP** for Lighthouse audit.

### Task 9.1: SEO meta tags + sitemap

**Files:**
- Modify: route files to add `<head>` meta
- Create: `app/api/sitemap.xml.ts`

```bash
git commit -m "feat(seo): add meta tags and sitemap"
```

### Task 9.2: Full E2E test suite

> Use **Playwright MCP** to record and run tests across all 4 viewports (desktop, tablet, mobile-chrome, mobile-safari).

Critical flows to cover (run at all 4 viewport sizes):
- Register → KYC prompt
- Browse projects → view detail → invest → stripe → success → dashboard shows investment
- Dashboard → view portfolio → distributions
- Admin → create project → publish → investor invests
- Responsive: sidebar drawer opens/closes on mobile, nav hamburger works, tables scroll

```bash
git commit -m "test(e2e): add critical user flow E2E tests across viewports"
```

### Task 9.3: Performance audit

- Lighthouse score target: 90+ Performance, 100 Accessibility, 100 Best Practices
- Bundle analysis: `pnpm build --analyze`
- Image optimization: Supabase storage transformation API
- Use **Chrome DevTools MCP** to run performance trace and identify bottlenecks

```bash
git commit -m "perf: optimize bundle and image loading"
```

### Task 9.4: Sentry production verification

- Verify Sentry DSN is set in Vercel production env via **Vercel MCP**
- Trigger a test error and confirm it appears in Sentry dashboard
- Check source maps are uploaded (stack traces show TypeScript lines, not minified)
- Set up alert rules: new issue, > 10 events/hr, performance regression

```bash
git commit -m "feat(monitoring): verify Sentry production setup with source maps"
```

### Task 9.5: Security audit

- Review all server functions for auth checks
- Verify Stripe webhook signature verification
- Verify Sumsub webhook HMAC
- Check RLS policies cover all access patterns
- Run `pnpm audit`

```bash
git commit -m "security: audit server functions and third-party webhook handlers"
```

### Task 9.6: Production deploy

```bash
vercel --prod
```

Verify:
- Stripe webhooks configured in Stripe dashboard
- Sumsub webhooks configured
- Supabase RLS enabled on all tables
- All env vars set in Vercel

```bash
git commit -m "chore(deploy): production launch checklist complete"
```

---

## Linear Issue Template

When creating in Linear, use this structure:

**Milestone** (as Linear Cycle or Project):
```
M1 · Foundation
```

**Feature** (as Linear Epic/Issue with label "feature"):
```
Title: [M1] Supabase clients
Description: Create browser, server and admin Supabase clients with typed env validation.
Labels: feature, backend
Estimate: 2 points
```

**Task** (as Linear sub-issue):
```
Title: [M1.3.1] Write failing test for browser client
Description: See docs/plans/2026-02-28-full-rewrite-implementation.md Task 1.3
Labels: task, tdd
Estimate: 0.5 points
```

Update Linear task status as you work:
- Start task → move to "In Progress"
- Tests green + committed → move to "Done"
- Update milestone progress automatically

---

## Commands Reference

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm test             # Jest unit tests
pnpm test:watch       # Jest watch mode
pnpm playwright test  # E2E tests
pnpm check            # Biome lint + format
pnpm fix              # Biome auto-fix
```
