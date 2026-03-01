// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@tanstack/react-start", () => ({
	createServerFn: () => ({
		handler: (fn: () => unknown) => fn,
	}),
}));

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("~/lib/supabase/server", () => ({
	createSupabaseServerClient: () => ({
		from: mockFrom,
		auth: { getUser: mockGetUser },
	}),
}));

describe("getDashboardSummary", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns zero values for new investor", async () => {
		mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
		// Mock investments returning empty array
		mockFrom.mockReturnValue({
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			in: vi.fn().mockResolvedValue({ data: [], error: null }),
		});

		const { getDashboardSummary } = await import("~/server/dashboard");
		const result = await getDashboardSummary();
		expect(result.activeInvestments).toBe(0);
		expect(result.totalInvested).toBe(0);
	});

	it("throws when user is not authenticated", async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });
		const { getDashboardSummary } = await import("~/server/dashboard");
		await expect(getDashboardSummary()).rejects.toThrow(/[Uu]nauthenticated/);
	});
});
