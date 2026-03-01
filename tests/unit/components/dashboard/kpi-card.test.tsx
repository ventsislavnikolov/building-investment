// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "~/components/dashboard/kpi-card";

describe("KpiCard", () => {
	it("renders label and value", () => {
		render(<KpiCard label="Total invested" value="€12,000" />);
		expect(screen.getByText("Total invested")).toBeDefined();
		expect(screen.getByText("€12,000")).toBeDefined();
	});

	it("renders trend when provided", () => {
		render(<KpiCard label="IRR" value="8.5%" trend="+1.2%" trendUp={true} />);
		expect(screen.getByText("+1.2%")).toBeDefined();
	});
});
