import { expect, test } from "@playwright/test";

test.describe("Investment flow (unauthenticated guard)", () => {
	test("invest page redirects to login when unauthenticated", async ({
		page,
	}) => {
		// Try to access a project's invest page directly
		await page.goto("/projects/sample-project/invest");
		await expect(page).toHaveURL(/login/);
	});

	test("success page is accessible at correct URL shape", async ({ page }) => {
		// Success page URL should be valid (won't have data without auth, but route exists)
		const response = await page.goto("/projects/sample-project/invest/success");
		// Either shows content or redirects — should not 404
		expect(response?.status()).not.toBe(404);
	});
});

test.describe("Project catalog → detail", () => {
	test("clicking a project card navigates to detail", async ({ page }) => {
		await page.goto("/projects");
		const firstCard = page.locator("a[href^='/projects/']").first();
		if (await firstCard.isVisible()) {
			await firstCard.click();
			await expect(page).toHaveURL(/\/projects\/.+/);
		}
	});
});
