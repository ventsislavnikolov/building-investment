import { expect, test } from "@playwright/test";

test("admin investments redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/en/admin/investments");
  await expect(page).toHaveURL(
    /\/en\/login\?next=%2Fen%2Fadmin%2Finvestments$/,
  );
});
