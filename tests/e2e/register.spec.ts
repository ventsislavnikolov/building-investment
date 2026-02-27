import { expect, test } from "@playwright/test";

test("register page renders English copy and form fields", async ({ page }) => {
  await page.goto("/register");

  await expect(
    page.getByRole("heading", { name: "Create Investor Account" }),
  ).toBeVisible();
  await expect(page.getByLabel("First name")).toBeVisible();
  await expect(page.getByLabel("Last name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel(/^Password$/)).toBeVisible();
});

test("register page renders Bulgarian copy", async ({ page }) => {
  await page.goto("/bg/register");
  await expect(
    page.getByRole("heading", { name: "Създай инвеститорски профил" }),
  ).toBeVisible();
});
