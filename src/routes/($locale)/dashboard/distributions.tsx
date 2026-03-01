import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getMyDistributions = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("Unauthenticated");

		const { data } = await supabase
			.from("distributions")
			.select(
				"id, amount, net_amount, distribution_type, status, paid_at, projects(title)",
			)
			.eq("investor_id", user.id)
			.order("paid_at", { ascending: false });

		return data ?? [];
	},
);

export const Route = createFileRoute(
	"/(locale)/dashboard/distributions" as never,
)({
	loader: () => getMyDistributions(),
	component: DistributionsPage,
});

const STATUS_COLORS: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800",
	paid: "bg-green-100 text-green-800",
	failed: "bg-red-100 text-red-800",
};

const TYPE_LABELS: Record<string, string> = {
	interest: "Interest",
	rental: "Rental Income",
	capital_return: "Capital Return",
	exit: "Exit Proceeds",
};

function DistributionsPage() {
	const distributions = Route.useLoaderData();

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-[#151515]">Distributions</h1>
				<p className="text-sm text-[#ACB3BA] mt-1">
					Income and returns from your investments
				</p>
			</div>

			{distributions.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-[#ACB3BA] p-12 text-center">
					<p className="text-[#ACB3BA]">No distributions yet.</p>
					<p className="text-sm text-[#ACB3BA] mt-1">
						Distributions will appear here once your investments start
						generating returns.
					</p>
				</div>
			) : (
				<div className="bg-white rounded-2xl border border-[#EEF2F6] overflow-hidden">
					<table className="w-full text-sm">
						<thead className="bg-[#EEF2F6] text-[#ACB3BA] uppercase text-xs">
							<tr>
								<th className="text-left px-4 py-3">Project</th>
								<th className="text-left px-4 py-3">Type</th>
								<th className="text-right px-4 py-3">Gross</th>
								<th className="text-right px-4 py-3">Net</th>
								<th className="text-left px-4 py-3">Date</th>
								<th className="text-left px-4 py-3">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#EEF2F6]">
							{distributions.map((d) => {
								const project = d.projects as { title: string } | null;
								return (
									<tr key={d.id} className="hover:bg-[#EEF2F6]/40">
										<td className="px-4 py-3 font-medium text-[#151515]">
											{project?.title ?? "—"}
										</td>
										<td className="px-4 py-3 text-[#ACB3BA]">
											{TYPE_LABELS[d.distribution_type] ?? d.distribution_type}
										</td>
										<td className="px-4 py-3 text-right">
											€{d.amount?.toLocaleString() ?? "—"}
										</td>
										<td className="px-4 py-3 text-right font-medium text-green-600">
											€{d.net_amount?.toLocaleString() ?? "—"}
										</td>
										<td className="px-4 py-3 text-[#ACB3BA]">
											{d.paid_at
												? new Date(d.paid_at).toLocaleDateString("en-GB")
												: "—"}
										</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[d.status] ?? "bg-gray-100 text-gray-800"}`}
											>
												{d.status}
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
