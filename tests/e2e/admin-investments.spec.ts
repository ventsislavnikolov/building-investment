import { expect, test } from "@playwright/test";

test("admin investments redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/investments");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Finvestments$/);
});
