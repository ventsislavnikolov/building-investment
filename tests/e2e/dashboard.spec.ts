import { expect, test } from "@playwright/test";

const DASHBOARD_ROUTES = [
	"/dashboard",
	"/dashboard/investments",
	"/dashboard/portfolio",
	"/dashboard/wallet",
	"/dashboard/transactions",
	"/dashboard/distributions",
	"/dashboard/favorites",
	"/dashboard/progress",
	"/dashboard/documents",
	"/dashboard/notifications",
	"/dashboard/kyc",
	"/dashboard/settings",
	"/dashboard/statements",
];

test.describe("Dashboard — auth guards", () => {
	for (const route of DASHBOARD_ROUTES) {
		test(`${route} redirects to login when unauthenticated`, async ({
			page,
		}) => {
			await page.goto(route);
			await expect(page).toHaveURL(/login/);
		});
	}
});

test.describe("Dashboard — BG locale auth guards", () => {
	for (const route of DASHBOARD_ROUTES) {
		test(`/bg${route} redirects to login when unauthenticated`, async ({
			page,
		}) => {
			await page.goto(`/bg${route}`);
			await expect(page).toHaveURL(/login/);
		});
	}
});
