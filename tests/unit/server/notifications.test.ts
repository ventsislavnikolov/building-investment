// @vitest-environment node
import { describe, it, expect, vi } from "vitest";

vi.mock("resend", () => ({
	Resend: vi.fn().mockImplementation(() => ({
		emails: {
			send: vi.fn().mockResolvedValue({ data: { id: "email-123" }, error: null }),
		},
	})),
}));

vi.mock("~/env", () => ({
	getRuntimeEnv: () => ({
		RESEND_API_KEY: "re_test_key",
		NEXT_PUBLIC_APP_URL: "https://app.buildinginvestment.bg",
	}),
}));

describe("sendInvestmentConfirmedEmail", () => {
	it("calls Resend with correct params", async () => {
		const { sendInvestmentConfirmedEmail } = await import(
			"~/server/notifications"
		);
		const result = await sendInvestmentConfirmedEmail({
			to: "investor@example.com",
			investorName: "Jane Doe",
			projectTitle: "Sunset Villas",
			amount: 5000,
			currency: "EUR",
		});
		expect(result).toEqual({ sent: true });
	});
});

describe("sendWelcomeEmail", () => {
	it("calls Resend with correct params", async () => {
		const { sendWelcomeEmail } = await import("~/server/notifications");
		const result = await sendWelcomeEmail({
			to: "new@example.com",
			name: "John",
		});
		expect(result).toEqual({ sent: true });
	});
});
