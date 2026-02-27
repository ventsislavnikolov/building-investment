import { expect, test } from "@playwright/test";

test("admin investors redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/investors");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Finvestors$/);
});
