import { expect, test } from "@playwright/test";

const ADMIN_ROUTES = [
	"/admin",
	"/admin/projects",
	"/admin/investors",
	"/admin/investments",
	"/admin/budget",
	"/admin/documents",
	"/admin/audit",
	"/admin/metrics",
];

test.describe("Admin — auth guards", () => {
	for (const route of ADMIN_ROUTES) {
		test(`${route} redirects to login when unauthenticated`, async ({
			page,
		}) => {
			await page.goto(route);
			await expect(page).toHaveURL(/login/);
		});
	}
});

test.describe("Admin — BG locale auth guards", () => {
	for (const route of ADMIN_ROUTES) {
		test(`/bg${route} redirects to login when unauthenticated`, async ({
			page,
		}) => {
			await page.goto(`/bg${route}`);
			await expect(page).toHaveURL(/login/);
		});
	}
});
