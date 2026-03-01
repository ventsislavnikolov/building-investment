import { expect, test } from "@playwright/test";

test.describe("Auth flows", () => {
	test("register page renders form", async ({ page }) => {
		await page.goto("/register");
		await expect(page.getByRole("heading", { name: /create/i })).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i).first()).toBeVisible();
	});

	test("login page renders form", async ({ page }) => {
		await page.goto("/login");
		await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
	});

	test("forgot password page renders", async ({ page }) => {
		await page.goto("/forgot-password");
		await expect(page.getByRole("heading", { name: /forgot/i })).toBeVisible();
	});

	test("unauthenticated user redirected from dashboard", async ({ page }) => {
		await page.goto("/dashboard");
		// Should redirect to login
		await expect(page).toHaveURL(/login/);
	});

	test("unauthenticated user redirected from admin", async ({ page }) => {
		await page.goto("/admin");
		await expect(page).toHaveURL(/login/);
	});
});
