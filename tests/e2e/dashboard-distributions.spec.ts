import { expect, test } from "@playwright/test";

test("distributions route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/en/dashboard/distributions");
  await expect(page).toHaveURL(
    /\/en\/login\?next=%2Fen%2Fdashboard%2Fdistributions$/,
  );
});
