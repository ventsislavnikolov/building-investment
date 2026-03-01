// @vitest-environment node
import { describe, it, expect } from "vitest";

describe("useFundingProgress", () => {
	it("exports a useFundingProgress hook", async () => {
		const mod = await import("~/hooks/use-funding-progress");
		expect(typeof mod.useFundingProgress).toBe("function");
	});
});

describe("useNotifications", () => {
	it("exports a useNotifications hook", async () => {
		const mod = await import("~/hooks/use-notifications");
		expect(typeof mod.useNotifications).toBe("function");
	});
});
