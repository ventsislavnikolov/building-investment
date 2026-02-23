import { expect, test } from "@playwright/test";

test("admin documents redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/en/admin/documents");
  await expect(page).toHaveURL(/\/en\/login\?next=%2Fen%2Fadmin%2Fdocuments$/);
});
