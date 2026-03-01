// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import crypto from "node:crypto";

vi.mock("@tanstack/react-start", () => ({
	createServerFn: () => ({
		handler: (fn: () => unknown) => fn,
	}),
}));

vi.mock("~/env", () => ({
	getRuntimeEnv: () => ({
		SUMSUB_APP_TOKEN: "test-token",
		SUMSUB_SECRET_KEY: "test-secret",
	}),
}));

describe("verifySumsubSignature", () => {
	it("returns true when signature matches", async () => {
		const { verifySumsubSignature } = await import("~/server/kyc");
		const payload = JSON.stringify({ type: "applicantReviewed" });
		const secret = "test-secret";
		const sig = crypto
			.createHmac("sha256", secret)
			.update(payload)
			.digest("hex");

		expect(verifySumsubSignature(payload, sig, secret)).toBe(true);
	});

	it("returns false when signature is wrong", async () => {
		const { verifySumsubSignature } = await import("~/server/kyc");
		expect(verifySumsubSignature("payload", "bad-sig", "secret")).toBe(false);
	});
});
