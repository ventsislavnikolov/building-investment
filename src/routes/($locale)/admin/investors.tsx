import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { localePath } from "~/lib/routing";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getAdminInvestors = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = createSupabaseAdminClient();
		const { data } = await supabase
			.from("profiles")
			.select(
				"id, full_name, email, kyc_status, total_invested, investments_count, created_at",
			)
			.eq("role", "investor")
			.order("created_at", { ascending: false });
		return data ?? [];
	},
);

const KYC_COLORS: Record<string, string> = {
	not_started: "bg-gray-100 text-gray-600",
	pending: "bg-amber-100 text-amber-700",
	approved: "bg-green-100 text-green-700",
	rejected: "bg-red-100 text-red-700",
};

function fmt(n: number) {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(n ?? 0);
}

export const Route = createFileRoute("/($locale)/admin/investors")({
	loader: async () => {
		const investors = await getAdminInvestors();
		return { investors };
	},
	component: function AdminInvestorsPage() {
		const { locale } = Route.useRouteContext();
		const { investors } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-6xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Investors</h1>
					<p className="text-muted mt-1">{investors.length} registered</p>
				</div>

				<div className="rounded-2xl border border-border bg-white overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="border-b border-border bg-[#f8f9fa]">
								<tr>
									<th className="text-left px-5 py-3 font-medium text-muted">
										Name
									</th>
									<th className="text-left px-5 py-3 font-medium text-muted">
										Email
									</th>
									<th className="text-left px-5 py-3 font-medium text-muted">
										KYC
									</th>
									<th className="text-right px-5 py-3 font-medium text-muted">
										Total Invested
									</th>
									<th className="text-right px-5 py-3 font-medium text-muted">
										Investments
									</th>
									<th className="text-right px-5 py-3 font-medium text-muted">
										Joined
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{investors.map((inv) => (
									<tr
										key={inv.id}
										className="hover:bg-[#f8f9fa] transition-colors"
									>
										<td className="px-5 py-3">
											<Link
												to={localePath(locale, `/admin/investors/${inv.id}`)}
												className="font-medium text-text hover:text-primary"
											>
												{inv.full_name ?? "—"}
											</Link>
										</td>
										<td className="px-5 py-3 text-muted">{inv.email}</td>
										<td className="px-5 py-3">
											<span
												className={`px-2 py-0.5 rounded-full text-xs font-medium ${KYC_COLORS[inv.kyc_status] ?? "bg-gray-100 text-gray-600"}`}
											>
												{(inv.kyc_status ?? "not_started").replace(/_/g, " ")}
											</span>
										</td>
										<td className="px-5 py-3 text-right">
											{fmt(inv.total_invested)}
										</td>
										<td className="px-5 py-3 text-right text-muted">
											{inv.investments_count ?? 0}
										</td>
										<td className="px-5 py-3 text-right text-muted">
											{new Date(inv.created_at).toLocaleDateString("en-GB")}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	},
});
