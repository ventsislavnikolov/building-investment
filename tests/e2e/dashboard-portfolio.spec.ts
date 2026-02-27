import { expect, test } from "@playwright/test";

test("portfolio route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/portfolio");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fportfolio$/);
});
