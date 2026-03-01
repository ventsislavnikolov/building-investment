import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getBudgetItems = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseAdminClient();
	const { data } = await supabase
		.from("budget_items")
		.select(
			"id, project_id, category, description, planned_amount, actual_amount, status, projects(title)",
		)
		.order("project_id")
		.order("category");
	return (data as BudgetItem[]) ?? [];
});

interface BudgetItem {
	id: string;
	project_id: string;
	category: string;
	description: string | null;
	planned_amount: number;
	actual_amount: number | null;
	status: string | null;
	projects: { title: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
	on_track: "bg-green-100 text-green-700",
	over_budget: "bg-red-100 text-red-700",
	under_budget: "bg-blue-100 text-blue-700",
};

function fmt(n: number | null) {
	if (n == null) return "—";
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(n);
}

export const Route = createFileRoute("/($locale)/admin/budget")({
	loader: async () => {
		const items = await getBudgetItems();
		return { items };
	},
	component: function BudgetPage() {
		const { items } = Route.useLoaderData();

		const totalPlanned = items.reduce(
			(sum, i) => sum + (i.planned_amount ?? 0),
			0,
		);
		const totalActual = items.reduce(
			(sum, i) => sum + (i.actual_amount ?? 0),
			0,
		);
		const variance = totalActual - totalPlanned;

		return (
			<div className="space-y-6 max-w-5xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Budget</h1>
					<p className="text-muted mt-1">
						CAPEX / OPEX tracking across projects
					</p>
				</div>

				{/* Totals row */}
				<div className="grid grid-cols-3 gap-4">
					{[
						{ label: "Total Planned", value: fmt(totalPlanned) },
						{ label: "Total Actual", value: fmt(totalActual) },
						{
							label: "Variance",
							value: fmt(Math.abs(variance)),
							color:
								variance > 0
									? "text-red-600"
									: variance < 0
										? "text-green-600"
										: "text-text",
							prefix: variance > 0 ? "+" : variance < 0 ? "-" : "",
						},
					].map((card) => (
						<div
							key={card.label}
							className="rounded-2xl border border-border bg-white p-5"
						>
							<p className="text-sm text-muted">{card.label}</p>
							<p
								className={`text-2xl font-bold mt-1 ${card.color ?? "text-text"}`}
							>
								{card.prefix}
								{card.value}
							</p>
						</div>
					))}
				</div>

				{items.length === 0 ? (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<p className="text-muted">No budget items found.</p>
					</div>
				) : (
					<div className="rounded-2xl border border-border bg-white overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b border-border bg-[#f8f9fa]">
									<tr>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Project
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Category
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Description
										</th>
										<th className="text-right px-5 py-3 font-medium text-muted">
											Planned
										</th>
										<th className="text-right px-5 py-3 font-medium text-muted">
											Actual
										</th>
										<th className="text-right px-5 py-3 font-medium text-muted">
											Status
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{items.map((item) => (
										<tr
											key={item.id}
											className="hover:bg-[#f8f9fa] transition-colors"
										>
											<td className="px-5 py-3 text-muted text-xs">
												{item.projects?.title ?? item.project_id.slice(0, 8)}
											</td>
											<td className="px-5 py-3 font-medium text-text capitalize">
												{item.category}
											</td>
											<td className="px-5 py-3 text-muted max-w-[200px] truncate">
												{item.description ?? "—"}
											</td>
											<td className="px-5 py-3 text-right text-text font-medium">
												{fmt(item.planned_amount)}
											</td>
											<td className="px-5 py-3 text-right text-text">
												{fmt(item.actual_amount)}
											</td>
											<td className="px-5 py-3 text-right">
												{item.status ? (
													<span
														className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-700"}`}
													>
														{item.status.replace(/_/g, " ")}
													</span>
												) : (
													"—"
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		);
	},
});
