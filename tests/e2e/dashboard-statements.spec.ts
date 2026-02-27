import { expect, test } from "@playwright/test";

test("statements route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/statements");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fstatements$/);
});
