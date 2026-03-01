import * as Sentry from "@sentry/react";

export function initSentry(dsn: string | undefined): void {
	if (!dsn) return;
	Sentry.init({
		dsn,
		tracesSampleRate: 0.1,
		environment: process.env.NODE_ENV ?? "production",
	});
}
