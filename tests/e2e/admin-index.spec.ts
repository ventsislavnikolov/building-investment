import { expect, test } from "@playwright/test";

test("admin index redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin$/);
});
