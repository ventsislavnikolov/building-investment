import { expect, test } from "@playwright/test";

test("projects page applies search and strategy filters", async ({ page }) => {
  await page.goto("/en/projects?strategy=buy_to_rent&q=varna");
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Varna Seaside Rentals" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sofia Apartment Reposition" }),
  ).toHaveCount(0);
});

test("projects page renders Bulgarian copy", async ({ page }) => {
  await page.goto("/bg/projects");
  await expect(page.getByRole("heading", { name: "Проекти" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Варненски апартаменти под наем" }),
  ).toBeVisible();
});
