import { expect, test } from "@playwright/test";

test("admin index redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/en/admin");
  await expect(page).toHaveURL(/\/en\/login\?next=%2Fen%2Fadmin$/);
});
