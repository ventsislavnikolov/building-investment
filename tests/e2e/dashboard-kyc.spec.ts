import { expect, test } from "@playwright/test";

test("kyc route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/kyc");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%2Fkyc$/);
});
