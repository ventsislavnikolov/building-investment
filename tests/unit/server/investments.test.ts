// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @tanstack/react-start
vi.mock("@tanstack/react-start", () => ({
	createServerFn: () => ({
		inputValidator: (schema: { parse: (v: unknown) => unknown }) => ({
			handler: (fn: (args: { data: unknown }) => unknown) =>
				(params: unknown) =>
					fn({ data: schema.parse(params) }),
		}),
	}),
}));

// Mock Stripe
const mockSessionCreate = vi.fn();
vi.mock("stripe", () => ({
	default: vi.fn().mockImplementation(() => ({
		checkout: {
			sessions: {
				create: mockSessionCreate,
			},
		},
	})),
}));

// Supabase query builder factory
function makeQueryBuilder(resolveData: unknown = null, resolveError: unknown = null) {
	const builder: Record<string, unknown> = {};
	const chainMethods = ["select", "eq", "in", "or", "neq", "order", "limit"];
	for (const method of chainMethods) {
		builder[method] = vi.fn(() => builder);
	}
	builder.single = vi.fn(() => Promise.resolve({ data: resolveData, error: resolveError }));
	builder.maybeSingle = vi.fn(() => Promise.resolve({ data: resolveData, error: resolveError }));
	builder.then = (resolve: (v: { data: unknown; error: unknown }) => unknown) =>
		Promise.resolve({ data: resolveData, error: resolveError }).then(resolve);
	return builder;
}

const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock("~/lib/supabase/server", () => ({
	createSupabaseServerClient: () => ({
		from: mockFrom,
		auth: { getUser: mockGetUser },
	}),
}));

vi.mock("~/lib/supabase/admin", () => ({
	createSupabaseAdminClient: () => ({
		from: mockFrom,
	}),
}));

vi.mock("~/env", () => ({
	getRuntimeEnv: () => ({
		STRIPE_SECRET_KEY: "sk_test_mock",
		NEXT_PUBLIC_APP_URL: "https://localhost:3000",
		STRIPE_WEBHOOK_SECRET: "whsec_mock",
	}),
}));

vi.mock("~/lib/auth/guards", () => ({
	requireAuth: (user: unknown) => {
		if (!user) throw new Error("Unauthenticated");
		return user;
	},
}));

describe("createInvestmentCheckout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
		mockSessionCreate.mockResolvedValue({ url: "https://checkout.stripe.com/session-url" });
	});

	it("throws when amount below project minimum", async () => {
		const projectData = {
			id: "project-1",
			slug: "test-project",
			title_en: "Test Project",
			min_investment: 500,
			max_investment: null,
			target_amount: 100000,
			funded_amount: 0,
			status: "fundraising",
			currency: "EUR",
		};
		mockFrom.mockReturnValue(makeQueryBuilder(projectData));

		const { createInvestmentCheckout } = await import("~/server/investments");
		await expect(
			createInvestmentCheckout({
				projectId: "project-1",
				amount: 100,
				locale: "en",
			}),
		).rejects.toThrow(/below minimum/);
	});

	it("throws when project is not in fundraising status", async () => {
		const projectData = {
			id: "project-1",
			slug: "test-project",
			title_en: "Test Project",
			min_investment: 500,
			max_investment: null,
			target_amount: 100000,
			funded_amount: 0,
			status: "completed",
			currency: "EUR",
		};
		mockFrom.mockReturnValue(makeQueryBuilder(projectData));

		const { createInvestmentCheckout } = await import("~/server/investments");
		await expect(
			createInvestmentCheckout({
				projectId: "project-1",
				amount: 1000,
				locale: "en",
			}),
		).rejects.toThrow(/not available/);
	});
});
