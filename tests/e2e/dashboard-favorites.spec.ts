import { expect, test } from "@playwright/test";

test("favorites route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/favorites");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Ffavorites$/);
});
