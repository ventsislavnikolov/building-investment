// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		to,
		...rest
	}: {
		children: React.ReactNode;
		to: string;
		[key: string]: unknown;
	}) => (
		<a href={to} {...rest}>
			{children}
		</a>
	),
	useRouterState: () => ({ location: { pathname: "/" } }),
}));

describe("MarketingNav", () => {
	it("renders login and register links", async () => {
		const { MarketingNav } = await import("~/components/marketing/nav");
		const { getAllByRole } = render(<MarketingNav locale="en" />);
		// Desktop + mobile both render these links
		expect(getAllByRole("link", { name: /login/i }).length).toBeGreaterThan(0);
		expect(
			getAllByRole("link", { name: /register/i }).length,
		).toBeGreaterThan(0);
	});

	it("renders logo home link", async () => {
		const { MarketingNav } = await import("~/components/marketing/nav");
		const { getByRole } = render(<MarketingNav locale="en" />);
		expect(getByRole("link", { name: /home/i })).toBeDefined();
	});
});
