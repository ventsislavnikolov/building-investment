import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { TrendingUp } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getPortfolioAnalytics = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("Unauthenticated");

		const { data: investments } = await supabase
			.from("investments")
			.select(
				"amount, total_returned, status, project:projects(title_en, strategy, projected_irr_min, projected_irr_max)",
			)
			.eq("investor_id", user.id)
			.in("status", ["active", "returning", "exited"]);

		const totalInvested =
			investments?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
		const totalReturned =
			investments?.reduce((sum, i) => sum + (i.total_returned ?? 0), 0) ?? 0;

		// Strategy allocation
		const byStrategy: Record<string, number> = {};
		for (const inv of investments ?? []) {
			const strategy =
				(inv.project as { strategy?: string } | null)?.strategy ?? "other";
			byStrategy[strategy] = (byStrategy[strategy] ?? 0) + inv.amount;
		}

		return {
			totalInvested,
			totalReturned,
			byStrategy,
			count: investments?.length ?? 0,
		};
	},
);

function fmt(n: number) {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(n);
}

const STRATEGY_LABELS: Record<string, string> = {
	flip: "Flip",
	buy_to_rent: "Buy to Rent",
	single_family: "Single Family",
	development: "Development",
};

export const Route = createFileRoute("/($locale)/dashboard/portfolio")({
	loader: async () => {
		const analytics = await getPortfolioAnalytics();
		return { analytics };
	},
	component: function PortfolioPage() {
		const { analytics } = Route.useLoaderData();

		const netReturn = analytics.totalReturned - analytics.totalInvested;
		const returnPct =
			analytics.totalInvested > 0
				? ((netReturn / analytics.totalInvested) * 100).toFixed(1)
				: "0.0";

		return (
			<div className="space-y-6 max-w-5xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Portfolio</h1>
					<p className="text-muted mt-1">
						{analytics.count} active investment(s)
					</p>
				</div>

				{/* Summary cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="rounded-2xl border border-border bg-white p-5">
						<p className="text-sm text-muted">Total Invested</p>
						<p className="text-2xl font-bold text-text mt-1">
							{fmt(analytics.totalInvested)}
						</p>
					</div>
					<div className="rounded-2xl border border-border bg-white p-5">
						<p className="text-sm text-muted">Total Returned</p>
						<p className="text-2xl font-bold text-text mt-1">
							{fmt(analytics.totalReturned)}
						</p>
					</div>
					<div className="rounded-2xl border border-border bg-white p-5">
						<p className="text-sm text-muted">Net Return</p>
						<p
							className={`text-2xl font-bold mt-1 ${netReturn >= 0 ? "text-success" : "text-destructive"}`}
						>
							{netReturn >= 0 ? "+" : ""}
							{returnPct}%
						</p>
					</div>
				</div>

				{/* Strategy allocation */}
				{Object.keys(analytics.byStrategy).length > 0 ? (
					<div className="rounded-2xl border border-border bg-white p-6">
						<h2 className="text-base font-semibold text-text mb-4">
							Allocation by Strategy
						</h2>
						<div className="space-y-3">
							{Object.entries(analytics.byStrategy).map(
								([strategy, amount]) => {
									const pct =
										analytics.totalInvested > 0
											? Math.round((amount / analytics.totalInvested) * 100)
											: 0;
									return (
										<div key={strategy}>
											<div className="flex justify-between text-sm mb-1">
												<span className="text-text font-medium">
													{STRATEGY_LABELS[strategy] ?? strategy}
												</span>
												<span className="text-muted">
													{fmt(amount)} ({pct}%)
												</span>
											</div>
											<div className="h-2 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
												<div
													className="h-full bg-primary rounded-full"
													style={{ width: `${pct}%` }}
												/>
											</div>
										</div>
									);
								},
							)}
						</div>
					</div>
				) : (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<TrendingUp className="w-10 h-10 text-muted mx-auto mb-3" />
						<p className="text-text font-medium">No portfolio data yet</p>
						<p className="text-sm text-muted mt-1">
							Invest in a project to see your portfolio analytics here.
						</p>
					</div>
				)}
			</div>
		);
	},
});
