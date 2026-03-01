import { beforeEach, describe, expect, it, vi } from "vitest";

// Chainable query builder mock
function makeQueryBuilder() {
	const calls: { method: string; args: unknown[] }[] = [];
	const builder: Record<string, unknown> = {};

	const methods = ["select", "eq", "in", "or", "maybeSingle"];
	for (const method of methods) {
		builder[method] = vi.fn((...args: unknown[]) => {
			calls.push({ method, args });
			if (method === "maybeSingle") {
				return Promise.resolve({ data: null, error: null });
			}
			return builder;
		});
	}

	// Make it awaitable (Supabase builders are Promise-like)
	builder.then = (resolve: (v: unknown) => unknown) =>
		Promise.resolve({ data: [], error: null }).then(resolve);

	(builder as { _calls: typeof calls })._calls = calls;
	return builder;
}

let queryBuilder = makeQueryBuilder();

vi.mock("~/lib/supabase/server", () => ({
	createSupabaseServerClient: () => ({
		from: () => queryBuilder,
	}),
}));

vi.mock("@tanstack/react-start", () => ({
	createServerFn: () => ({
		validator: (schema: { parse: (v: unknown) => unknown }) => ({
			handler: (fn: (ctx: { data: unknown }) => unknown) =>
				(params: unknown) =>
					fn({ data: schema.parse(params) }),
		}),
	}),
}));

describe("project server functions", () => {
	beforeEach(() => {
		queryBuilder = makeQueryBuilder();
	});

	it("getPublishedProjects queries correct status values", async () => {
		const { getPublishedProjects } = await import("~/server/projects");
		await getPublishedProjects({
			locale: "en",
			search: "",
			strategy: "all",
			sort: "featured",
			page: 1,
		});
		expect(queryBuilder.in).toHaveBeenCalledWith("status", [
			"fundraising",
			"funded",
			"in_execution",
			"exiting",
			"completed",
		]);
	});

	it("getPublishedProjects filters by strategy when not all", async () => {
		const { getPublishedProjects } = await import("~/server/projects");
		await getPublishedProjects({
			locale: "en",
			search: "",
			strategy: "flip",
			sort: "featured",
			page: 1,
		});
		expect(queryBuilder.eq).toHaveBeenCalledWith("strategy", "flip");
	});
});
