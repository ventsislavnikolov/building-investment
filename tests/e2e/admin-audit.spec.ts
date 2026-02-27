import { expect, test } from "@playwright/test";

test("admin audit redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/audit");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Faudit$/);
});
