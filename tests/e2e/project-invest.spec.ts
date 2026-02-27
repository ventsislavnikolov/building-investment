import { expect, test } from "@playwright/test";

test("invest route redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/projects/varna-seaside-rentals/invest");
  await expect(page).toHaveURL(
    /\/login\?next=%2Fprojects%2Fvarna-seaside-rentals%2Finvest$/,
  );
});
