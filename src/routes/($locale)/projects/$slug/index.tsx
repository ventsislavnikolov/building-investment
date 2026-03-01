import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MarketingFooter } from "~/components/marketing/footer";
import { MarketingNav } from "~/components/marketing/nav";
import { FinancialSnapshot } from "~/components/projects/financial-snapshot";
import { InvestmentCalculator } from "~/components/projects/investment-calculator";
import { ProjectGallery } from "~/components/projects/project-gallery";
import { getLocaleFromParams, localePath } from "~/lib/routing";
import { cn } from "~/lib/utils";

const STRATEGY_LABELS: Record<string, string> = {
	flip: "Flip",
	buy_to_rent: "Buy to Rent",
	single_family: "Single Family",
	development: "Development",
};

const STATUS_COLORS: Record<string, string> = {
	fundraising: "bg-green-100 text-green-700",
	funded: "bg-blue-100 text-blue-700",
	in_execution: "bg-purple-100 text-purple-700",
	exiting: "bg-amber-100 text-amber-700",
	completed: "bg-gray-100 text-gray-700",
};

export const Route = createFileRoute("/($locale)/projects/$slug/")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	loader: async ({ context, params }) => {
		const { getProjectBySlug } = await import("~/server/projects");
		const project = await getProjectBySlug({
			slug: params.slug,
			locale: context.locale,
		});
		if (!project) throw notFound();
		return { project };
	},
	notFoundComponent: () => (
		<div className="flex min-h-screen items-center justify-center">
			<p className="text-muted">Project not found.</p>
		</div>
	),
	component: function ProjectDetailPage() {
		const { locale } = Route.useRouteContext();
		const { project } = Route.useLoaderData();
		const p = project as Record<string, unknown> & {
			title: string;
			city: string;
			strategy: string;
			status: string;
			fundedPct: number;
			min_investment: number;
			projected_irr_min: number;
			projected_irr_max: number;
			target_amount: number;
			funded_amount: number;
			investor_count: number;
			estimated_duration_months: number;
			cover_images: string[];
			currency: string;
			slug: string;
			id: string;
		};

		return (
			<div className="flex flex-col min-h-screen">
				<MarketingNav locale={locale} />
				<main className="flex-1 bg-[#f8f9fa] py-8 sm:py-12">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						{/* Back link */}
						<Link
							to={localePath(locale, "/projects")}
							className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-6 transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to projects
						</Link>

						<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,420px]">
							{/* Left column */}
							<div className="space-y-6">
								<ProjectGallery images={p.cover_images} title={p.title} />

								{/* Title + metadata */}
								<div>
									<div className="flex flex-wrap gap-2 mb-3">
										<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
											{STRATEGY_LABELS[p.strategy] ?? p.strategy}
										</span>
										<span
											className={cn(
												"px-2 py-0.5 rounded-full text-xs font-medium",
												STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-700",
											)}
										>
											{p.status.replace(/_/g, " ")}
										</span>
									</div>
									<h1 className="text-2xl sm:text-3xl font-bold text-text">
										{p.title}
									</h1>
									<p className="text-muted mt-1">{p.city}, Bulgaria</p>
								</div>
							</div>

							{/* Right column */}
							<div className="space-y-4">
								<FinancialSnapshot project={p} locale={locale} />
								<InvestmentCalculator project={p} locale={locale} />
							</div>
						</div>
					</div>
				</main>
				<MarketingFooter locale={locale} />
			</div>
		);
	},
});
