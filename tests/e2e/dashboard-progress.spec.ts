import { expect, test } from "@playwright/test";

test("progress route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/progress");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fprogress$/);
});
