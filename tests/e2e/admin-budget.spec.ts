import { expect, test } from "@playwright/test";

test("admin budget redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/budget");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fbudget$/);
});
