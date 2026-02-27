import { expect, test } from "@playwright/test";

test("admin metrics redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/metrics");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fmetrics$/);
});
