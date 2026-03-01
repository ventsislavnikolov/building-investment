import { expect, test } from "@playwright/test";

test("how it works page renders 4 steps", async ({ page }) => {
	await page.goto("/how-it-works");
	const steps = page.locator('[data-testid="step"]');
	await expect(steps).toHaveCount(4);
});
