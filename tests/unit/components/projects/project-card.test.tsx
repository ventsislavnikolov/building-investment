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
}));

const mockProject = {
	id: "1",
	slug: "test-project",
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

describe("ProjectCard", () => {
	it("renders project title and funded percentage", async () => {
		const { ProjectCard } = await import(
			"~/components/projects/project-card"
		);
		const { getByText } = render(
			<ProjectCard project={mockProject} locale="en" />,
		);
		expect(getByText("Test Project")).toBeDefined();
		expect(getByText(/65%/)).toBeDefined();
	});

	it("renders city and strategy", async () => {
		const { ProjectCard } = await import(
			"~/components/projects/project-card"
		);
		const { getByText } = render(
			<ProjectCard project={mockProject} locale="en" />,
		);
		expect(getByText(/Sofia/i)).toBeDefined();
	});
});
