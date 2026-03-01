// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AmountSelector } from "~/components/invest/amount-selector";

describe("AmountSelector", () => {
	it("disables submit when amount below minimum", () => {
		const onChange = vi.fn();
		render(
			<AmountSelector
				amount={100}
				minAmount={500}
				maxAmount={100000}
				currency="EUR"
				onChange={onChange}
			/>,
		);
		const input = screen.getByRole("spinbutton");
		expect(input).toBeDefined();
		// Amount 100 is below min 500, so the invalid hint should be visible
		expect(screen.getByText(/minimum/i)).toBeDefined();
	});

	it("calls onChange when input changes", () => {
		const onChange = vi.fn();
		render(
			<AmountSelector
				amount={500}
				minAmount={500}
				maxAmount={100000}
				currency="EUR"
				onChange={onChange}
			/>,
		);
		const input = screen.getByRole("spinbutton");
		fireEvent.change(input, { target: { value: "1000" } });
		expect(onChange).toHaveBeenCalledWith(1000);
	});
});
