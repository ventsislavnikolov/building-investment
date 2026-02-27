import { expect, test } from "@playwright/test";

test("settings route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/settings");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fsettings$/);
});
