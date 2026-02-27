import { expect, test } from "@playwright/test";

test("how-it-works page renders localized headings", async ({ page }) => {
  await page.goto("/how-it-works");
  await expect(
    page.getByRole("heading", { name: "How It Works" }),
  ).toBeVisible();

  await page.goto("/bg/how-it-works");
  await expect(page.getByRole("heading", { name: "Как Работи" })).toBeVisible();
});
