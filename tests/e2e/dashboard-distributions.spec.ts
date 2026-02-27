import { expect, test } from "@playwright/test";

test("distributions route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/distributions");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fdistributions$/);
});
