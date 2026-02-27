import { expect, test } from "@playwright/test";

test("homepage renders the MVP headline", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: /invest in bulgarian real estate/i }),
  ).toBeVisible();
});

test("dashboard redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("homepage CTAs respect current locale", async ({ page }) => {
  await page.goto("/bg");
  await expect(page.locator('a[href="/bg/projects"]')).toHaveCount(1);
  await expect(page.locator('a[href="/bg/how-it-works"]')).toHaveCount(1);
});
