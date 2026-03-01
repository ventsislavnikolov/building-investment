import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getMetrics = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseAdminClient();

	const [projectsRes, investmentsRes, profilesRes] = await Promise.all([
		supabase
			.from("projects")
			.select(
				"id, status, target_amount, funded_amount, projected_irr_min, projected_irr_max",
			),
		supabase
			.from("investments")
			.select("amount, status, created_at")
			.eq("status", "confirmed"),
		supabase
			.from("profiles")
			.select("id, created_at, role")
			.eq("role", "investor"),
	]);

	const projects = projectsRes.data ?? [];
	const investments = investmentsRes.data ?? [];
	const profiles = profilesRes.data ?? [];

	const aum = investments.reduce((s, i) => s + (i.amount ?? 0), 0);
	const totalProjects = projects.length;
	const fundraisingProjects = projects.filter(
		(p) => p.status === "fundraising",
	).length;
	const totalInvestors = profiles.length;

	// Monthly investment volume (last 6 months)
	const now = new Date();
	const months: { label: string; amount: number }[] = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const label = d.toLocaleString("en-GB", {
			month: "short",
			year: "2-digit",
		});
		const monthStart = d.toISOString().slice(0, 7);
		const amount = investments
			.filter((inv) => inv.created_at?.startsWith(monthStart))
			.reduce((s, inv) => s + (inv.amount ?? 0), 0);
		months.push({ label, amount });
	}

	return { aum, totalProjects, fundraisingProjects, totalInvestors, months };
});

function fmt(n: number) {
	if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `€${(n / 1_000).toFixed(0)}K`;
	return `€${n}`;
}

export const Route = createFileRoute("/($locale)/admin/metrics")({
	loader: async () => getMetrics(),
	component: function MetricsPage() {
		const { aum, totalProjects, fundraisingProjects, totalInvestors, months } =
			Route.useLoaderData();

		const maxMonthAmount = Math.max(...months.map((m) => m.amount), 1);

		return (
			<div className="space-y-6 max-w-5xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Platform Metrics</h1>
					<p className="text-muted mt-1">Overview of platform performance</p>
				</div>

				{/* KPI cards */}
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{[
						{ label: "Assets Under Management", value: fmt(aum) },
						{ label: "Total Projects", value: String(totalProjects) },
						{ label: "Fundraising Now", value: String(fundraisingProjects) },
						{ label: "Total Investors", value: String(totalInvestors) },
					].map((kpi) => (
						<div
							key={kpi.label}
							className="rounded-2xl border border-border bg-white p-5"
						>
							<p className="text-xs text-muted">{kpi.label}</p>
							<p className="text-2xl font-bold text-text mt-1">{kpi.value}</p>
						</div>
					))}
				</div>

				{/* Monthly investment bar chart */}
				<div className="rounded-2xl border border-border bg-white p-6">
					<h2 className="font-semibold text-text mb-5">
						Monthly Investment Volume (last 6 months)
					</h2>
					<div className="flex items-end gap-3 h-40">
						{months.map((m) => (
							<div
								key={m.label}
								className="flex-1 flex flex-col items-center gap-1"
							>
								<span className="text-xs text-muted">{fmt(m.amount)}</span>
								<div
									className="w-full bg-primary rounded-t-md"
									style={{
										height: `${Math.round((m.amount / maxMonthAmount) * 100)}%`,
										minHeight: m.amount > 0 ? "4px" : "0",
									}}
								/>
								<span className="text-xs text-muted">{m.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	},
});
