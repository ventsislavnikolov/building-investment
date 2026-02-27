import { expect, test } from "@playwright/test";

test("investments route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/investments");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Finvestments$/);
});
