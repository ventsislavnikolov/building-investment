import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@sentry/react", () => ({
	init: vi.fn(),
	captureException: vi.fn(),
	setUser: vi.fn(),
}));

describe("initSentry", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("does not call Sentry.init when DSN is not provided", async () => {
		const { initSentry } = await import("~/lib/monitoring/sentry");
		const { init } = await import("@sentry/react");
		initSentry(undefined);
		expect(init).not.toHaveBeenCalled();
	});

	it("calls Sentry.init with DSN when provided", async () => {
		const { initSentry } = await import("~/lib/monitoring/sentry");
		const { init } = await import("@sentry/react");
		initSentry("https://test@sentry.io/123");
		expect(init).toHaveBeenCalledWith(
			expect.objectContaining({ dsn: "https://test@sentry.io/123" }),
		);
	});

	it("includes tracesSampleRate in config", async () => {
		const { initSentry } = await import("~/lib/monitoring/sentry");
		const { init } = await import("@sentry/react");
		initSentry("https://test@sentry.io/456");
		expect(init).toHaveBeenCalledWith(
			expect.objectContaining({ tracesSampleRate: expect.any(Number) }),
		);
	});
});
