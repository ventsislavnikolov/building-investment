import { expect, test } from "@playwright/test";

test("project catalog page renders", async ({ page }) => {
	await page.goto("/projects");
	await expect(page.getByRole("heading", { name: /investment projects/i })).toBeVisible();
});
