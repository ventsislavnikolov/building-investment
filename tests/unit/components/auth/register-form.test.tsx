// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
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

describe("RegisterForm", () => {
	it("shows error when passwords do not match", async () => {
		const { RegisterForm } = await import("~/components/auth/register-form");
		const { getByLabelText, getByRole, findByText } = render(
			<RegisterForm onSubmit={vi.fn()} />,
		);
		fireEvent.change(getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(getByLabelText("Password"), {
			target: { value: "password123" },
		});
		fireEvent.change(getByLabelText(/confirm password/i), {
			target: { value: "different456" },
		});
		fireEvent.click(getByRole("button", { name: /create account/i }));
		await findByText(/passwords do not match/i);
	});

	it("shows email error for invalid email", async () => {
		const { RegisterForm } = await import("~/components/auth/register-form");
		const { getByLabelText, getByRole, findByText } = render(
			<RegisterForm onSubmit={vi.fn()} />,
		);
		fireEvent.change(getByLabelText(/email/i), {
			target: { value: "bad-email" },
		});
		fireEvent.click(getByRole("button", { name: /create account/i }));
		await findByText(/valid email/i);
	});
});
