import { expect, test } from "@playwright/test";

test("admin projects redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/projects");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fprojects$/);
});
