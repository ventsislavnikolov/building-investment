import { expect, test } from "@playwright/test";

test.describe("Responsive — marketing pages", () => {
	test("landing page renders at current viewport", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		// Nav is visible
		await expect(page.locator("nav")).toBeVisible();
	});

	test("projects catalog renders at current viewport", async ({ page }) => {
		await page.goto("/projects");
		await expect(
			page.getByRole("heading", { name: /projects/i }),
		).toBeVisible();
	});

	test("how it works page renders", async ({ page }) => {
		await page.goto("/how-it-works");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});

	test("about page renders", async ({ page }) => {
		await page.goto("/about");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});
});

test.describe("Responsive — BG locale", () => {
	test("Bulgarian landing page renders", async ({ page }) => {
		await page.goto("/bg");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});

	test("Bulgarian projects page renders", async ({ page }) => {
		await page.goto("/bg/projects");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});
});
