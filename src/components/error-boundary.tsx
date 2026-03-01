import * as Sentry from "@sentry/react";
import type { ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
	return (
		<Sentry.ErrorBoundary
			fallback={
				fallback ?? (
					<div className="flex min-h-screen items-center justify-center">
						<div className="text-center">
							<h1 className="text-2xl font-semibold text-text">
								Something went wrong
							</h1>
							<p className="mt-2 text-muted">
								Please refresh the page or contact support.
							</p>
						</div>
					</div>
				)
			}
		>
			{children}
		</Sentry.ErrorBoundary>
	);
}
