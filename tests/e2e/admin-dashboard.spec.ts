import { expect, test } from "@playwright/test";

test("admin dashboard redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fdashboard$/);
});
