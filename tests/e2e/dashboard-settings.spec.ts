import { expect, test } from "@playwright/test";

test("settings route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/en/dashboard/settings");
  await expect(page).toHaveURL(
    /\/en\/login\?next=%2Fen%2Fdashboard%2Fsettings$/,
  );
});
