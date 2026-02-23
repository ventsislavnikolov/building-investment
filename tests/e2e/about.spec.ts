import { expect, test } from "@playwright/test";

test("about page renders localized headings", async ({ page }) => {
  await page.goto("/en/about");
  await expect(
    page.getByRole("heading", { name: "About Building Investment" }),
  ).toBeVisible();

  await page.goto("/bg/about");
  await expect(
    page.getByRole("heading", { name: "За Building Investment" }),
  ).toBeVisible();
});
