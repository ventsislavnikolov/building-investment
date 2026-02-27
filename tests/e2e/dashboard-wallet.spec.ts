import { expect, test } from "@playwright/test";

test("wallet route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/wallet");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fwallet$/);
});
