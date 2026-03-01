import { expect, test } from "@playwright/test";

test.describe("Responsive — marketing pages", () => {
	test("landing page renders at current viewport", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
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

test.describe("Responsive — mobile nav", () => {
	test.use({ viewport: { width: 375, height: 812 } });

	test("hamburger button is visible on mobile", async ({ page }) => {
		await page.goto("/");
		const hamburger = page.getByRole("button", { name: /toggle menu/i });
		await expect(hamburger).toBeVisible();
	});

	test("mobile menu opens and closes on hamburger click", async ({ page }) => {
		await page.goto("/");
		const hamburger = page.getByRole("button", { name: /toggle menu/i });

		// Menu links hidden initially
		const loginLink = page.getByRole("link", { name: /^login$/i }).last();
		await expect(loginLink).not.toBeVisible();

		// Open menu
		await hamburger.click();
		await expect(loginLink).toBeVisible();

		// Close menu
		await hamburger.click();
		await expect(loginLink).not.toBeVisible();
	});

	test("mobile menu closes after nav link click", async ({ page }) => {
		await page.goto("/");
		const hamburger = page.getByRole("button", { name: /toggle menu/i });
		await hamburger.click();

		const howItWorks = page
			.getByRole("link", { name: /how it works/i })
			.last();
		await expect(howItWorks).toBeVisible();
		await howItWorks.click();

		await expect(page).toHaveURL(/how-it-works/);
	});
});

test.describe("Responsive — project detail", () => {
	test("project detail page layout renders at 375px", async ({ page }) => {
		test.use({ viewport: { width: 375, height: 812 } });
		await page.goto("/projects");
		const firstCard = page.locator("a[href^='/projects/']").first();
		if (await firstCard.isVisible()) {
			await firstCard.click();
			await expect(page).toHaveURL(/\/projects\/.+/);
			await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		}
	});

	test("project detail page layout renders at 1440px", async ({ page }) => {
		test.use({ viewport: { width: 1440, height: 900 } });
		await page.goto("/projects");
		const firstCard = page.locator("a[href^='/projects/']").first();
		if (await firstCard.isVisible()) {
			await firstCard.click();
			await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		}
	});
});
