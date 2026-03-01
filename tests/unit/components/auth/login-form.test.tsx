// @vitest-environment jsdom
import { fireEvent, render, waitFor } from "@testing-library/react";
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

describe("LoginForm", () => {
	it("shows email error when invalid email submitted", async () => {
		const { LoginForm } = await import("~/components/auth/login-form");
		const { getByLabelText, getByRole, findByText } = render(
			<LoginForm onSubmit={vi.fn()} />,
		);
		fireEvent.change(getByLabelText(/email/i), {
			target: { value: "notanemail" },
		});
		fireEvent.click(getByRole("button", { name: /sign in/i }));
		await findByText(/valid email/i);
	});

	it("shows password error when too short", async () => {
		const { LoginForm } = await import("~/components/auth/login-form");
		const { getByLabelText, getByRole, findByText } = render(
			<LoginForm onSubmit={vi.fn()} />,
		);
		fireEvent.change(getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(getByLabelText("Password"), {
			target: { value: "123" },
		});
		fireEvent.click(getByRole("button", { name: /sign in/i }));
		await findByText(/at least 6/i);
	});
});
