import { describe, expect, it, vi } from "vitest";

// Stub route modules — verify they export a Route with a component
vi.mock("~/lib/supabase/server", () => ({
	createSupabaseServerClient: vi.fn(() => ({
		auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }) },
		from: vi.fn().mockReturnThis(),
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		order: vi.fn().mockReturnThis(),
		then: vi.fn().mockResolvedValue({ data: [], error: null }),
	})),
}));

describe("Dashboard missing pages — module exports", () => {
	it("distributions page exports Route", async () => {
		const mod = await import(
			"~/routes/($locale)/dashboard/distributions"
		);
		expect(mod.Route).toBeDefined();
	});

	it("progress page exports Route", async () => {
		const mod = await import("~/routes/($locale)/dashboard/progress");
		expect(mod.Route).toBeDefined();
	});

	it("kyc page exports Route", async () => {
		const mod = await import("~/routes/($locale)/dashboard/kyc");
		expect(mod.Route).toBeDefined();
	});

	it("statements page exports Route", async () => {
		const mod = await import("~/routes/($locale)/dashboard/statements");
		expect(mod.Route).toBeDefined();
	});
});
