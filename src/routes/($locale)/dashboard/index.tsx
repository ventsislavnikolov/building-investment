import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeftRight,
	Coins,
	FolderOpen,
	LayoutDashboard,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { KpiCard } from "~/components/dashboard/kpi-card";
import { localePath } from "~/lib/routing";

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(amount);
}

export const Route = createFileRoute("/($locale)/dashboard/")({
	loader: async () => {
		const { getDashboardSummary } = await import("~/server/dashboard");
		const summary = await getDashboardSummary();
		return { summary };
	},
	component: function DashboardPage() {
		const { locale, user, profile } = Route.useRouteContext();
		const { summary } = Route.useLoaderData();

		const name = profile
			? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
				user?.email ||
				"Investor"
			: (user?.email ?? "Investor");
		const firstName = name.split(" ")[0];

		const kpis = [
			{
				label: "Active Investments",
				value: String(summary.activeInvestments),
				icon: <LayoutDashboard className="w-4 h-4" />,
			},
			{
				label: "Total Invested",
				value: formatCurrency(summary.totalInvested),
				icon: <Coins className="w-4 h-4" />,
			},
			{
				label: "Total Returned",
				value: formatCurrency(summary.totalReturned),
				icon: <TrendingUp className="w-4 h-4" />,
			},
			{
				label: "Net Exposure",
				value: formatCurrency(summary.netExposure),
				icon: <Wallet className="w-4 h-4" />,
			},
		];

		const quickLinks = [
			{
				label: "Browse Projects",
				href: localePath(locale, "/projects"),
				icon: <TrendingUp className="w-5 h-5" />,
			},
			{
				label: "Portfolio",
				href: localePath(locale, "/dashboard/portfolio"),
				icon: <TrendingUp className="w-5 h-5" />,
			},
			{
				label: "Wallet",
				href: localePath(locale, "/dashboard/wallet"),
				icon: <Wallet className="w-5 h-5" />,
			},
			{
				label: "Documents",
				href: localePath(locale, "/dashboard/documents"),
				icon: <FolderOpen className="w-5 h-5" />,
			},
			{
				label: "Transactions",
				href: localePath(locale, "/dashboard/transactions"),
				icon: <ArrowLeftRight className="w-5 h-5" />,
			},
		];

		return (
			<div className="space-y-6 max-w-5xl">
				{/* Greeting */}
				<div>
					<h1 className="text-2xl font-bold text-text">
						Welcome back, {firstName}
					</h1>
					<p className="text-muted mt-1">
						Here's an overview of your portfolio
					</p>
				</div>

				{/* KPI cards */}
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

				{/* Quick links */}
				<div>
					<h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
						Quick actions
					</h2>
					<div className="flex flex-wrap gap-2">
						{quickLinks.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm font-medium text-text hover:border-primary hover:text-primary transition-colors"
							>
								<span className="text-muted">{link.icon}</span>
								{link.label}
							</Link>
						))}
					</div>
				</div>

				{/* Empty state for no investments */}
				{summary.activeInvestments === 0 && (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
							<Coins className="w-7 h-7 text-primary" />
						</div>
						<h3 className="text-base font-semibold text-text mb-1">
							No investments yet
						</h3>
						<p className="text-sm text-muted mb-4">
							Start investing in Bulgarian real estate projects today.
						</p>
						<Link
							to={localePath(locale, "/projects")}
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
						>
							Browse projects
						</Link>
					</div>
				)}
			</div>
		);
	},
});
