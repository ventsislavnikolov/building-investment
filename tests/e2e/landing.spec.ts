import { expect, test } from "@playwright/test";

test("landing page loads with hero CTA", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	await expect(page.getByRole("link", { name: /get started/i }).first()).toBeVisible();
});

test("/bg/ shows Bulgarian content", async ({ page }) => {
	await page.goto("/bg");
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
