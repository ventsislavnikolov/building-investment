// @vitest-environment node
import { describe, it, expect, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
	redirect: (opts: { to: string }) => {
		throw new Error(`REDIRECT:${opts.to}`);
	},
}));

describe("requireAdmin", () => {
	it("throws redirect when profile is null", async () => {
		const { requireAdmin } = await import("~/lib/auth/guards");
		expect(() => requireAdmin(null, "en")).toThrow(/REDIRECT/);
	});

	it("throws redirect when role is investor", async () => {
		const { requireAdmin } = await import("~/lib/auth/guards");
		expect(() =>
			requireAdmin({ id: "1", role: "investor" }, "en"),
		).toThrow(/REDIRECT/);
	});

	it("returns profile when role is admin", async () => {
		const { requireAdmin } = await import("~/lib/auth/guards");
		const profile = { id: "1", role: "admin" };
		expect(requireAdmin(profile, "en")).toBe(profile);
	});
});
