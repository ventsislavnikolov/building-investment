import { expect, test } from "@playwright/test";

test("notifications route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/notifications");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fnotifications$/);
});
