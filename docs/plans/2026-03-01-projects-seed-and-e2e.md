# Projects Seed + E2E Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Seed 4 Bulgarian real estate projects into Supabase + rewrite Playwright E2E tests to cover the full projects flow.

**Architecture:** Seed runs via Supabase MCP `execute_sql` (service role, bypasses RLS). Tests use Playwright against `localhost:3000` (dev server with real Supabase). The `projects_select_published` RLS policy permits anon reads of published projects without `auth.uid()` — so seeded data is immediately visible to the app with the anon key.

**Tech Stack:** Supabase MCP (`execute_sql`), Playwright, TanStack Router, `data-testid="project-card"`

**Supabase project ID:** `wfsdsrsbcjxfzpptnoso`

---

### Task 1: Seed projects into Supabase

**Files:** None (DB only via Supabase MCP)

**Step 1: Run seed SQL via Supabase MCP `execute_sql`**

```sql
INSERT INTO projects (
  slug, title_bg, title_en, description_bg, description_en,
  strategy, status, city, property_type,
  target_amount, min_investment, funded_amount, investor_count, currency,
  projected_irr_min, projected_irr_max, projected_roi_min, projected_roi_max,
  estimated_duration_months, risk_score, cover_images, fundraise_end
) VALUES
(
  'sofia-flip-lozenets',
  'Обновяване в Лозенец',
  'Lozenets Renovation',
  'Апартамент в квартал Лозенец, пълно обновяване и продажба.',
  'Full gut renovation of a 3-bedroom apartment in Lozenets, Sofia. Target resale within 8 months.',
  'flip', 'fundraising', 'Sofia', 'apartment',
  120000, 500, 78000, 14, 'EUR',
  14, 18, 12, 16,
  8, 4, '{}', NOW() + INTERVAL '60 days'
),
(
  'plovdiv-buy-to-rent',
  'Апартамент в Капана',
  'Kapana Apartment',
  'Апартамент в квартал Капана, Пловдив. Дългосрочно отдаване под наем.',
  'Studio apartment in the trendy Kapana district of Plovdiv. Long-term rental strategy.',
  'buy_to_rent', 'in_execution', 'Plovdiv', 'apartment',
  80000, 250, 80000, 27, 'EUR',
  8, 11, 7, 10,
  36, 3, '{}', NULL
),
(
  'varna-dev-sea-view',
  'Морска панорама — Варна',
  'Sea View Complex',
  'Малък жилищен комплекс с морска гледка до Варна. Ново строителство.',
  'Small residential development with sea views near Varna. Ground-up construction, 12 units.',
  'development', 'fundraising', 'Varna', 'building',
  450000, 1000, 135000, 11, 'EUR',
  12, 16, 10, 14,
  24, 6, '{}', NOW() + INTERVAL '90 days'
),
(
  'sofia-land-boyana',
  'Парцел в Бояна',
  'Boyana Land Prep',
  'Придобиване на парцел в Бояна и подготовка за строителство.',
  'Land acquisition and permit preparation in the Boyana district of Sofia for future residential development.',
  'land_prep', 'funded', 'Sofia', 'land',
  200000, 500, 200000, 38, 'EUR',
  10, 14, 9, 13,
  18, 5, '{}', NULL
)
ON CONFLICT (slug) DO NOTHING;
```

**Step 2: Verify rows inserted**

Run via Supabase MCP:
```sql
SELECT slug, status, funded_amount, target_amount FROM projects ORDER BY created_at;
```
Expected: 4 rows returned.

---

### Task 2: Seed milestones for detail pages

**Files:** None (DB only)

**Step 1: Run milestone seed SQL**

```sql
INSERT INTO milestones (
  project_id, title_bg, title_en, description_en,
  status, sort_order, planned_date
)
SELECT
  p.id,
  m.title_bg, m.title_en, m.description_en,
  m.status::milestone_status, m.sort_order, m.planned_date::DATE
FROM projects p
CROSS JOIN (VALUES
  ('Придобиване', 'Acquisition', 'Property purchase and legal transfer complete.', 'completed', 0, '2026-01-15'),
  ('Обновяване', 'Renovation', 'Full interior and exterior renovation works.', 'in_progress', 1, '2026-04-30')
) AS m(title_bg, title_en, description_en, status, sort_order, planned_date)
WHERE p.slug = 'sofia-flip-lozenets'
ON CONFLICT DO NOTHING;

INSERT INTO milestones (
  project_id, title_bg, title_en, description_en,
  status, sort_order, planned_date
)
SELECT
  p.id,
  m.title_bg, m.title_en, m.description_en,
  m.status::milestone_status, m.sort_order, m.planned_date::DATE
FROM projects p
CROSS JOIN (VALUES
  ('Наем', 'Rental Start', 'Tenant onboarded, rental income flowing.', 'completed', 0, '2025-09-01'),
  ('Преглед', 'Annual Review', 'Portfolio review and rent adjustment.', 'planned', 1, '2026-09-01')
) AS m(title_bg, title_en, description_en, status, sort_order, planned_date)
WHERE p.slug = 'plovdiv-buy-to-rent'
ON CONFLICT DO NOTHING;
```

**Step 2: Verify milestones**

```sql
SELECT p.slug, m.title_en, m.status FROM milestones m JOIN projects p ON p.id = m.project_id;
```
Expected: 4 rows (2 per project, for the 2 projects with milestones).

---

### Task 3: Verify projects page works in browser

**Step 1: Start dev server**

```bash
pnpm dev
```

**Step 2: Open http://localhost:3000/projects and confirm:**
- Page renders without error boundary
- At least one project card visible
- Navigate to `/projects/sofia-flip-lozenets` — detail page renders

---

### Task 4: Rewrite Playwright tests (TDD)

**Files:**
- Modify: `tests/e2e/projects.spec.ts`

**Step 1: Write the full test file**

Replace `tests/e2e/projects.spec.ts` with:

```typescript
import { expect, test } from "@playwright/test";

// ─── Catalog Page ──────────────────────────────────────────────────────────

test.describe("Projects catalog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
  });

  test("renders heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /investment projects/i }),
    ).toBeVisible();
  });

  test("renders at least one project card", async ({ page }) => {
    await expect(
      page.locator('[data-testid="project-card"]').first(),
    ).toBeVisible();
  });

  test("renders filter bar with search input", async ({ page }) => {
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test("shows project count label", async ({ page }) => {
    // ProjectFilterBar renders something like "4 projects"
    await expect(page.getByText(/project/i)).toBeVisible();
  });

  test("no error boundary shown", async ({ page }) => {
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible();
    await expect(page.getByText(/error/i)).not.toBeVisible();
  });
});

// ─── Project Detail Page ───────────────────────────────────────────────────

test.describe("Project detail — Lozenets Renovation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/sofia-flip-lozenets");
  });

  test("renders project title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /lozenets renovation/i }),
    ).toBeVisible();
  });

  test("shows city Sofia", async ({ page }) => {
    await expect(page.getByText(/sofia/i).first()).toBeVisible();
  });

  test("shows IRR range", async ({ page }) => {
    await expect(page.getByText(/14/)).toBeVisible();
  });

  test("shows Back to projects link", async ({ page }) => {
    await expect(page.getByText(/back to projects/i)).toBeVisible();
  });

  test("shows Invest now button or link", async ({ page }) => {
    await expect(page.getByText(/invest/i).first()).toBeVisible();
  });

  test("no error shown", async ({ page }) => {
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible();
    await expect(page.getByText(/not found/i)).not.toBeVisible();
  });
});

// ─── Navigation Flow ───────────────────────────────────────────────────────

test("clicking a project card navigates to detail page", async ({ page }) => {
  await page.goto("/projects");
  const firstCard = page.locator('[data-testid="project-card"]').first();
  const href = await firstCard.getAttribute("href");
  await firstCard.click();
  await expect(page).toHaveURL(/\/projects\//);
  // detail page has a heading
  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("back to projects link returns to catalog", async ({ page }) => {
  await page.goto("/projects/sofia-flip-lozenets");
  await page.getByText(/back to projects/i).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole("heading", { name: /investment projects/i }),
  ).toBeVisible();
});

// ─── Cross-page Smoke Tests ────────────────────────────────────────────────

const publicRoutes = ["/", "/projects", "/about", "/how-it-works"] as const;

for (const route of publicRoutes) {
  test(`${route} — no error boundary`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible();
    await expect(
      page.getByRole("heading").first(),
    ).toBeVisible();
  });
}
```

**Step 2: Run tests against dev server**

Ensure dev server is running on port 3000, then:
```bash
pnpm exec playwright test tests/e2e/projects.spec.ts --reporter=list
```

Expected: All tests pass (green). If any fail, investigate — likely a selector mismatch.

**Step 3: Run full E2E suite to check for regressions**

```bash
pnpm exec playwright test --reporter=list
```

Expected: All E2E tests green.

**Step 4: Commit**

```bash
git add tests/e2e/projects.spec.ts docs/plans/2026-03-01-projects-seed-and-e2e.md docs/plans/2026-03-01-projects-seed-and-e2e-design.md
git commit -m "test(e2e): rewrite projects spec with catalog, detail, and navigation coverage"
```

---

### Task 5: Update progress doc

**Files:**
- Modify: `docs/progress.md`

**Step 1: Update "Last updated" date and add note about seeded data**

Add under "Current State":
```
- 4 seed projects inserted into Supabase (sofia-flip-lozenets, plovdiv-buy-to-rent, varna-dev-sea-view, sofia-land-boyana)
- Projects E2E spec rewritten: catalog, detail, navigation, smoke tests
```

**Step 2: Commit**

```bash
git add docs/progress.md
git commit -m "docs: record seed projects and E2E test expansion"
```
