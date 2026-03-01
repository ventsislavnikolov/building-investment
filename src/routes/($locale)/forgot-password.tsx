import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ForgotPasswordForm } from "~/components/auth/forgot-password-form";
import { getLocaleFromParams, localePath } from "~/lib/routing";

export const Route = createFileRoute("/($locale)/forgot-password")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function ForgotPasswordPage() {
		const { locale } = Route.useRouteContext();
		const [isLoading, setIsLoading] = useState(false);
		const [error, setError] = useState<string | undefined>();

		return (
			<div className="min-h-screen bg-surface flex flex-col">
				<div className="p-4">
					<a
						href={localePath(locale, "/")}
						className="inline-flex items-center gap-2"
					>
						<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
							<span className="text-white font-bold text-sm">B</span>
						</div>
						<span className="font-semibold text-text">BuildInvest</span>
					</a>
				</div>

				<div className="flex-1 flex items-center justify-center p-4">
					<div className="w-full max-w-md">
						<div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
							<div className="mb-8">
								<h1 className="text-2xl font-bold text-text">
									Forgot password
								</h1>
								<p className="mt-1 text-sm text-muted">
									Enter your email and we'll send you a reset link
								</p>
							</div>

							<ForgotPasswordForm
								onSubmit={async (email) => {
									setIsLoading(true);
									setError(undefined);
									try {
										const supabase = await import("~/lib/supabase/client").then(
											(m) => m.createBrowserClient(),
										);
										const { error: err } =
											await supabase.auth.resetPasswordForEmail(email, {
												redirectTo: `${window.location.origin}${localePath(locale, "/reset-password")}`,
											});
										if (err) setError(err.message);
									} catch {
										setError("An unexpected error occurred. Please try again.");
									} finally {
										setIsLoading(false);
									}
								}}
								isLoading={isLoading}
								error={error}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	},
});
