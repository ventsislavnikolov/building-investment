# Design: Projects Seed + E2E Tests

**Date:** 2026-03-01

## Problem

`/projects` throws an error because the Supabase DB has no projects. RLS policy `projects_select_published` is correct (no `auth.uid()` guard — anon key can read published projects) but there are zero rows to return.

## Solution

1. Seed 4 realistic Bulgarian projects via Supabase MCP
2. Rewrite `tests/e2e/projects.spec.ts` with comprehensive coverage

---

## Part 1 — DB Seed

Insert 4 projects + milestones using `execute_sql` via Supabase MCP.

| slug | title_en | city | strategy | status | target_amount | funded_amount | IRR |
|---|---|---|---|---|---|---|---|
| `sofia-flip-lozenets` | Lozenets Renovation | Sofia | flip | fundraising | 120000 | 78000 | 14–18% |
| `plovdiv-buy-to-rent` | Kapana Apartment | Plovdiv | buy_to_rent | in_execution | 80000 | 80000 | 8–11% |
| `varna-dev-sea-view` | Sea View Complex | Varna | development | fundraising | 450000 | 135000 | 12–16% |
| `sofia-land-boyana` | Boyana Land Prep | Sofia | land_prep | funded | 200000 | 200000 | 10–14% |

Each project gets 2 milestones so the detail page renders milestones section.

---

## Part 2 — Playwright Tests

File: `tests/e2e/projects.spec.ts` (full rewrite)

### Catalog page (`/projects`)
- Heading "Investment Projects" visible
- `[data-testid="project-card"]` count ≥ 1
- Filter bar elements visible (search input)
- No error text ("Error", "Something went wrong") on page

### Project detail (`/projects/sofia-flip-lozenets`)
- Project title visible
- City "Sofia" visible
- IRR range visible ("14")
- "Back to projects" link present
- Invest button/link present

### Navigation flow
- Clicking first project card from catalog navigates to detail URL (`/projects/`)
- Back link on detail returns to `/projects`

### Cross-page smoke (no-error guard)
- `/`, `/projects`, `/about`, `/how-it-works` — all render without error text

---

## Files Changed

- **New data:** Supabase `projects` + `milestones` tables (via MCP SQL)
- **Modified:** `tests/e2e/projects.spec.ts`
