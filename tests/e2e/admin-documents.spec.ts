import { expect, test } from "@playwright/test";

test("admin documents redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/documents");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fdocuments$/);
});
