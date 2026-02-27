import { expect, test } from "@playwright/test";

test("dashboard projects route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/projects");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fprojects$/);
});
