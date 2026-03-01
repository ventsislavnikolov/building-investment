import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start", () => ({
	createServerFn: () => ({
		inputValidator: (schema: (d: unknown) => unknown) => ({
			handler: (fn: (ctx: { data: unknown }) => unknown) => (params: unknown) =>
				fn({ data: schema(params) }),
		}),
	}),
}));

vi.mock("~/lib/supabase/admin", () => ({
	createSupabaseAdminClient: vi.fn(() => ({
		from: vi.fn().mockReturnThis(),
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		single: vi.fn().mockResolvedValue({ data: null, error: null }),
		order: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		then: vi.fn().mockResolvedValue({ data: [], error: null }),
	})),
}));

describe("Admin detail pages — module exports", () => {
	it("project detail page exports Route", async () => {
		const mod = await import("~/routes/($locale)/admin/projects/$id");
		expect(mod.Route).toBeDefined();
	});

	it("investor detail page exports Route", async () => {
		const mod = await import("~/routes/($locale)/admin/investors/$id");
		expect(mod.Route).toBeDefined();
	});
});
