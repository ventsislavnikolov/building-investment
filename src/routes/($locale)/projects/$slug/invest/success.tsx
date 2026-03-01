import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { getLocaleFromParams, localePath } from "~/lib/routing";

export const Route = createFileRoute(
	"/($locale)/projects/$slug/invest/success",
)({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function InvestSuccessPage() {
		const { locale } = Route.useRouteContext();
		const { slug } = Route.useParams();

		return (
			<div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center px-4">
				<div className="w-full max-w-md text-center space-y-6">
					{/* Icon */}
					<div className="mx-auto w-20 h-20 rounded-full bg-[#cee8fb] flex items-center justify-center">
						<CheckCircle className="w-10 h-10 text-primary" />
					</div>

					{/* Heading */}
					<div>
						<h1 className="text-2xl font-bold text-text">
							Your investment was successful!
						</h1>
						<p className="text-muted mt-2">
							Thank you for investing. You will receive a confirmation email
							shortly with all the details.
						</p>
					</div>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link
							to={localePath(locale, "/dashboard")}
							className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
						>
							Go to dashboard
						</Link>
						<Link
							to={localePath(locale, `/projects/${slug}`)}
							className="px-6 py-3 rounded-xl border border-border bg-white text-sm font-medium text-text hover:border-primary hover:text-primary transition-colors"
						>
							Back to project
						</Link>
					</div>
				</div>
			</div>
		);
	},
});
