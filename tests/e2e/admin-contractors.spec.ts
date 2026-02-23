import { expect, test } from "@playwright/test";

test("admin contractors redirects to login when session cookie is missing", async ({
  page,
}) => {
  await page.goto("/en/admin/contractors");
  await expect(page).toHaveURL(
    /\/en\/login\?next=%2Fen%2Fadmin%2Fcontractors$/,
  );
});
