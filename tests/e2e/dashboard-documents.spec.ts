import { expect, test } from "@playwright/test";

test("documents route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/documents");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fdocuments$/);
});
