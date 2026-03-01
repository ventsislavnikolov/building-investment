import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Wallet } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getWalletData = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthenticated");

	const { data: transactions } = await supabase
		.from("transactions")
		.select("id, type, amount, currency, description, created_at, status")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false })
		.limit(20);

	return { transactions: transactions ?? [] };
});

const TYPE_LABELS: Record<string, string> = {
	deposit: "Deposit",
	withdrawal: "Withdrawal",
	investment: "Investment",
	distribution: "Distribution",
	fee: "Fee",
};

function fmt(n: number, currency = "EUR") {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency,
		maximumFractionDigits: 2,
	}).format(n);
}

export const Route = createFileRoute("/($locale)/dashboard/wallet")({
	loader: async () => {
		const data = await getWalletData();
		return data;
	},
	component: function WalletPage() {
		const { transactions } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-3xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Wallet</h1>
					<p className="text-muted mt-1">Transaction history</p>
				</div>

				{/* Coming soon deposit/withdraw */}
				<div className="rounded-2xl border border-border bg-[#cee8fb] p-6 flex items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
						<Wallet className="w-6 h-6 text-white" />
					</div>
					<div>
						<p className="font-semibold text-text">Deposit / Withdraw</p>
						<p className="text-sm text-muted">
							Coming soon — bank transfer support
						</p>
					</div>
				</div>

				{/* Transaction list */}
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
										<th className="text-right px-5 py-3 font-medium text-muted">
											Amount
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
											<td className="px-5 py-3">
												<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
													{TYPE_LABELS[tx.type] ?? tx.type}
												</span>
											</td>
											<td className="px-5 py-3 text-muted">
												{tx.description ?? "—"}
											</td>
											<td
												className={`px-5 py-3 text-right font-semibold ${tx.type === "deposit" || tx.type === "distribution" ? "text-success" : "text-text"}`}
											>
												{tx.type === "deposit" || tx.type === "distribution"
													? "+"
													: "-"}
												{fmt(Math.abs(tx.amount), tx.currency)}
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
