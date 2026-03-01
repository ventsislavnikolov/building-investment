// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const mockProject = {
	id: "1",
	slug: "test",
	title: "Test Project",
	city: "Sofia",
	strategy: "flip",
	status: "fundraising",
	fundedPct: 65,
	min_investment: 500,
	projected_irr_min: 8,
	projected_irr_max: 12,
	target_amount: 100000,
	funded_amount: 65000,
	investor_count: 24,
	estimated_duration_months: 18,
	cover_images: [] as string[],
	currency: "EUR",
};

describe("FinancialSnapshot", () => {
	it("renders IRR range and min investment", async () => {
		const { FinancialSnapshot } = await import(
			"~/components/projects/financial-snapshot"
		);
		const { getByText } = render(
			<FinancialSnapshot project={mockProject} locale="en" />,
		);
		expect(getByText(/8.*12%/)).toBeDefined();
		expect(getByText(/€500/)).toBeDefined();
	});

	it("renders funded percentage", async () => {
		const { FinancialSnapshot } = await import(
			"~/components/projects/financial-snapshot"
		);
		const { getAllByText } = render(
			<FinancialSnapshot project={mockProject} locale="en" />,
		);
		expect(getAllByText(/65%/).length).toBeGreaterThan(0);
	});
});
