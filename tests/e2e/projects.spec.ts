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
    await expect(page.getByText(/project/i)).toBeVisible();
  });

  test("no error boundary shown", async ({ page }) => {
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible();
    await expect(page.getByText(/^error$/i)).not.toBeVisible();
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

  test("shows invest button or link", async ({ page }) => {
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
  await firstCard.click();
  await expect(page).toHaveURL(/\/projects\//);
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
  test(`${route} — renders without error`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByText(/something went wrong/i)).not.toBeVisible();
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
}
