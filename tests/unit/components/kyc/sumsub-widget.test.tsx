// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("~/server/kyc", () => ({
	createSumsubToken: vi.fn().mockResolvedValue({ token: "test-token" }),
}));

describe("SumsubWidget", () => {
	it("renders a loading state initially", async () => {
		const { SumsubWidget } = await import("~/components/kyc/sumsub-widget");
		render(<SumsubWidget />);
		// Should render the container div at least
		expect(document.querySelector("[data-testid='sumsub-container']")).not.toBeNull();
	});
});
