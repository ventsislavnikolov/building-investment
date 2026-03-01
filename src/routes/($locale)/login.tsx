import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LoginForm } from "~/components/auth/login-form";
import { getLocaleFromParams, localePath } from "~/lib/routing";

export const Route = createFileRoute("/($locale)/login")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function LoginPage() {
		const { locale } = Route.useRouteContext();
		const navigate = useNavigate();
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
								<h1 className="text-2xl font-bold text-text">Welcome back</h1>
								<p className="mt-1 text-sm text-muted">
									Sign in to your account to continue
								</p>
							</div>

							<LoginForm
								onSubmit={async (data) => {
									setIsLoading(true);
									setError(undefined);
									try {
										const { loginAction } = await import("~/server/auth");
										const result = await loginAction({ data });
										if ("error" in result) {
											setError(result.error);
										} else {
											await navigate({ to: localePath(locale, "/dashboard") });
										}
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
