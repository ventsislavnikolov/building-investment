import { expect, test } from "@playwright/test";

test("opens project detail from catalog card", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("link", { name: "Varna Seaside Rentals" }).click();
  await expect(page).toHaveURL(/\/projects\/varna-seaside-rentals$/);
  await expect(
    page.getByRole("heading", { name: "Varna Seaside Rentals" }),
  ).toBeVisible();
});

test("renders Bulgarian project detail copy", async ({ page }) => {
  await page.goto("/bg/projects/varna-seaside-rentals");
  await expect(
    page.getByRole("heading", { name: "Варненски апартаменти под наем" }),
  ).toBeVisible();
});
