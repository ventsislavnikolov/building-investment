import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getMyTransactions = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("Unauthenticated");

		const { data } = await supabase
			.from("transactions")
			.select(
				"id, type, amount, currency, description, reference, created_at, status",
			)
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });

		return data ?? [];
	},
);

function fmt(n: number, currency = "EUR") {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency,
		maximumFractionDigits: 2,
	}).format(n);
}

const STATUS_COLORS: Record<string, string> = {
	completed: "bg-green-100 text-green-700",
	pending: "bg-amber-100 text-amber-700",
	failed: "bg-red-100 text-red-700",
};

export const Route = createFileRoute("/($locale)/dashboard/transactions")({
	loader: async () => {
		const transactions = await getMyTransactions();
		return { transactions };
	},
	component: function TransactionsPage() {
		const { transactions } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-5xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Transactions</h1>
					<p className="text-muted mt-1">
						{transactions.length} transaction(s)
					</p>
				</div>

				{transactions.length === 0 ? (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<p className="text-muted">No transactions yet.</p>
					</div>
				) : (
					<div className="rounded-2xl border border-border bg-white overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b border-border bg-[#f8f9fa]">
									<tr>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Type
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Description
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Reference
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
									{transactions.map((tx) => (
										<tr
											key={tx.id}
											className="hover:bg-[#f8f9fa] transition-colors"
										>
											<td className="px-5 py-3 capitalize">{tx.type}</td>
											<td className="px-5 py-3 text-muted">
												{tx.description ?? "—"}
											</td>
											<td className="px-5 py-3 text-muted font-mono text-xs">
												{tx.reference ?? "—"}
											</td>
											<td className="px-5 py-3 text-right font-semibold text-text">
												{fmt(tx.amount, tx.currency)}
											</td>
											<td className="px-5 py-3">
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[tx.status] ?? "bg-gray-100 text-gray-700"}`}
												>
													{tx.status}
												</span>
											</td>
											<td className="px-5 py-3 text-right text-muted">
												{new Date(tx.created_at).toLocaleDateString("en-GB")}
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
