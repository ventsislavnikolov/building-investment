// @vitest-environment node
import { describe, it, expect } from "vitest";

describe("renderInvestmentConfirmedEmail", () => {
	it("contains formatted amount", async () => {
		const { renderInvestmentConfirmedEmail } = await import(
			"~/lib/email/templates"
		);
		const html = renderInvestmentConfirmedEmail({
			amount: 1000,
			currency: "EUR",
			projectTitle: "Sunset Villas",
			investorName: "John Doe",
		});
		expect(html).toContain("1,000");
		expect(html).toContain("Sunset Villas");
	});
});

describe("renderWelcomeEmail", () => {
	it("contains investor name", async () => {
		const { renderWelcomeEmail } = await import("~/lib/email/templates");
		const html = renderWelcomeEmail({ name: "Jane" });
		expect(html).toContain("Jane");
	});
});
