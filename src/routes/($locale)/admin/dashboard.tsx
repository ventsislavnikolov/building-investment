import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Coins, LayoutDashboard, TrendingUp, Users } from "lucide-react";
import { KpiCard } from "~/components/dashboard/kpi-card";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getAdminMetrics = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseAdminClient();

	const [
		{ count: investorCount },
		{ count: projectCount },
		{ data: investments },
		{ data: distributions },
	] = await Promise.all([
		supabase
			.from("profiles")
			.select("id", { count: "exact", head: true })
			.eq("role", "investor"),
		supabase
			.from("projects")
			.select("id", { count: "exact", head: true })
			.in("status", ["fundraising", "funded", "in_execution"]),
		supabase
			.from("investments")
			.select("amount")
			.in("status", ["active", "returning", "exited"]),
		supabase.from("distributions").select("net_amount").eq("status", "paid"),
	]);

	const totalAum = investments?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
	const totalDistributions =
		distributions?.reduce((sum, d) => sum + d.net_amount, 0) ?? 0;

	return {
		investorCount: investorCount ?? 0,
		activeProjectCount: projectCount ?? 0,
		totalAum,
		totalDistributions,
	};
});

function fmt(n: number) {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(n);
}

export const Route = createFileRoute("/($locale)/admin/dashboard")({
	loader: async () => {
		const metrics = await getAdminMetrics();
		return { metrics };
	},
	component: function AdminDashboardPage() {
		const { metrics } = Route.useLoaderData();

		const kpis = [
			{
				label: "Total AUM",
				value: fmt(metrics.totalAum),
				icon: <Coins className="w-4 h-4" />,
			},
			{
				label: "Active Investors",
				value: metrics.investorCount.toLocaleString(),
				icon: <Users className="w-4 h-4" />,
			},
			{
				label: "Active Projects",
				value: metrics.activeProjectCount.toLocaleString(),
				icon: <LayoutDashboard className="w-4 h-4" />,
			},
			{
				label: "Total Distributions Paid",
				value: fmt(metrics.totalDistributions),
				icon: <TrendingUp className="w-4 h-4" />,
			},
		];

		return (
			<div className="space-y-6 max-w-5xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
					<p className="text-muted mt-1">Platform overview</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{kpis.map((kpi) => (
						<KpiCard
							key={kpi.label}
							label={kpi.label}
							value={kpi.value}
							icon={kpi.icon}
						/>
					))}
				</div>
			</div>
		);
	},
});
