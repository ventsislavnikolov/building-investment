import { expect, test } from "@playwright/test";

test("dashboard project detail redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/dashboard/projects/varna-seaside-rentals");
  await expect(page).toHaveURL(
    /\/login\?next=%2Fdashboard%2Fprojects%2Fvarna-seaside-rentals$/,
  );
});
