import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getAllInvestments = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = createSupabaseAdminClient();
		const { data } = await supabase
			.from("investments")
			.select(
				`id, amount, status, paid_at,
       investor:profiles(first_name, last_name, email),
       project:projects(title_en, slug)`,
			)
			.order("paid_at", { ascending: false });
		return data ?? [];
	},
);

const STATUS_COLORS: Record<string, string> = {
	active: "bg-green-100 text-green-700",
	returning: "bg-blue-100 text-blue-700",
	exited: "bg-gray-100 text-gray-700",
	cancelled: "bg-red-100 text-red-700",
};

function fmt(n: number) {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(n);
}

export const Route = createFileRoute("/($locale)/admin/investments")({
	loader: async () => {
		const investments = await getAllInvestments();
		return { investments };
	},
	component: function AdminInvestmentsPage() {
		const { investments } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-6xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Cap Table</h1>
					<p className="text-muted mt-1">{investments.length} investment(s)</p>
				</div>

				<div className="rounded-2xl border border-border bg-white overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="border-b border-border bg-[#f8f9fa]">
								<tr>
									<th className="text-left px-5 py-3 font-medium text-muted">
										Investor
									</th>
									<th className="text-left px-5 py-3 font-medium text-muted">
										Project
									</th>
									<th className="text-right px-5 py-3 font-medium text-muted">
										Amount
									</th>
									<th className="text-left px-5 py-3 font-medium text-muted">
										Status
									</th>
									<th className="text-right px-5 py-3 font-medium text-muted">
										Date
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{investments.map((inv) => {
									const investor = inv.investor as {
										first_name?: string | null;
										last_name?: string | null;
										email: string;
									} | null;
									const project = inv.project as {
										title_en: string;
									} | null;
									return (
										<tr
											key={inv.id}
											className="hover:bg-[#f8f9fa] transition-colors"
										>
											<td className="px-5 py-3">
												<p className="font-medium text-text">
													{`${investor?.first_name ?? ""} ${investor?.last_name ?? ""}`.trim() ||
														"—"}
												</p>
												<p className="text-xs text-muted">{investor?.email}</p>
											</td>
											<td className="px-5 py-3 text-muted">
												{project?.title_en ?? "—"}
											</td>
											<td className="px-5 py-3 text-right font-semibold text-text">
												{fmt(inv.amount)}
											</td>
											<td className="px-5 py-3">
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status] ?? "bg-gray-100 text-gray-700"}`}
												>
													{inv.status}
												</span>
											</td>
											<td className="px-5 py-3 text-right text-muted">
												{inv.paid_at
													? new Date(inv.paid_at).toLocaleDateString("en-GB")
													: "—"}
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
