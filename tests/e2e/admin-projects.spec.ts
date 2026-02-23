import { expect, test } from "@playwright/test";

test("admin projects redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/en/admin/projects");
  await expect(page).toHaveURL(/\/en\/login\?next=%2Fen%2Fadmin%2Fprojects$/);
});
