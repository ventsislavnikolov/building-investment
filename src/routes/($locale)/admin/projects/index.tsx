import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { localePath } from "~/lib/routing";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";
import { cn } from "~/lib/utils";

const getAdminProjects = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseAdminClient();
	const { data } = await supabase
		.from("projects")
		.select(
			"id, slug, title_en, status, strategy, city, target_amount, funded_amount, investor_count, created_at",
		)
		.order("created_at", { ascending: false });
	return data ?? [];
});

const STATUS_COLORS: Record<string, string> = {
	draft: "bg-gray-100 text-gray-700",
	in_review: "bg-amber-100 text-amber-700",
	approved: "bg-blue-100 text-blue-700",
	fundraising: "bg-green-100 text-green-700",
	funded: "bg-purple-100 text-purple-700",
	in_execution: "bg-indigo-100 text-indigo-700",
	exiting: "bg-orange-100 text-orange-700",
	completed: "bg-gray-100 text-gray-600",
};

const _STATUS_TABS = [
	"all",
	"draft",
	"in_review",
	"approved",
	"fundraising",
	"funded",
	"in_execution",
	"completed",
];

function fmt(n: number) {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(n);
}

export const Route = createFileRoute("/($locale)/admin/projects/")({
	loader: async () => {
		const projects = await getAdminProjects();
		return { projects };
	},
	component: function AdminProjectsPage() {
		const { locale } = Route.useRouteContext();
		const { projects } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-6xl">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-text">Projects</h1>
						<p className="text-muted mt-1">{projects.length} total</p>
					</div>
					<Link
						to={localePath(locale, "/admin/projects/new")}
						className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
					>
						<Plus className="w-4 h-4" />
						New project
					</Link>
				</div>

				<div className="rounded-2xl border border-border bg-white overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="border-b border-border bg-[#f8f9fa]">
								<tr>
									<th className="text-left px-5 py-3 font-medium text-muted">
										Title
									</th>
									<th className="text-left px-5 py-3 font-medium text-muted">
										Status
									</th>
									<th className="text-left px-5 py-3 font-medium text-muted">
										Strategy
									</th>
									<th className="text-left px-5 py-3 font-medium text-muted">
										City
									</th>
									<th className="text-right px-5 py-3 font-medium text-muted">
										Target
									</th>
									<th className="text-right px-5 py-3 font-medium text-muted">
										Funded %
									</th>
									<th className="text-right px-5 py-3 font-medium text-muted">
										Investors
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{projects.map((p) => {
									const fundedPct =
										p.target_amount > 0
											? Math.round((p.funded_amount / p.target_amount) * 100)
											: 0;
									return (
										<tr
											key={p.id}
											className="hover:bg-[#f8f9fa] transition-colors"
										>
											<td className="px-5 py-3">
												<Link
													to={localePath(locale, `/admin/projects/${p.id}`)}
													className="font-medium text-text hover:text-primary"
												>
													{p.title_en}
												</Link>
											</td>
											<td className="px-5 py-3">
												<span
													className={cn(
														"px-2 py-0.5 rounded-full text-xs font-medium",
														STATUS_COLORS[p.status] ??
															"bg-gray-100 text-gray-700",
													)}
												>
													{p.status.replace(/_/g, " ")}
												</span>
											</td>
											<td className="px-5 py-3 text-muted capitalize">
												{p.strategy.replace(/_/g, " ")}
											</td>
											<td className="px-5 py-3 text-muted">{p.city}</td>
											<td className="px-5 py-3 text-right">
												{fmt(p.target_amount)}
											</td>
											<td className="px-5 py-3 text-right">
												<span
													className={
														fundedPct >= 100
															? "text-success font-medium"
															: "text-text"
													}
												>
													{fundedPct}%
												</span>
											</td>
											<td className="px-5 py-3 text-right text-muted">
												{p.investor_count}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	},
});
