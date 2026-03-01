import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Building2 } from "lucide-react";
import { localePath } from "~/lib/routing";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getMyInvestments = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthenticated");

	const { data } = await supabase
		.from("investments")
		.select(
			`
      id, amount, status, paid_at, total_returned,
      project:projects(id, slug, title_en, title_bg, cover_images, projected_irr_min, projected_irr_max, currency, status)
    `,
		)
		.eq("investor_id", user.id)
		.order("paid_at", { ascending: false });

	return data ?? [];
});

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

export const Route = createFileRoute("/($locale)/dashboard/investments")({
	loader: async () => {
		const investments = await getMyInvestments();
		return { investments };
	},
	component: function InvestmentsPage() {
		const { locale } = Route.useRouteContext();
		const { investments } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-5xl">
				<div>
					<h1 className="text-2xl font-bold text-text">My Investments</h1>
					<p className="text-muted mt-1">{investments.length} investment(s)</p>
				</div>

				{investments.length === 0 ? (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<Building2 className="w-10 h-10 text-muted mx-auto mb-3" />
						<p className="text-text font-medium">No investments yet</p>
						<Link
							to={localePath(locale, "/projects")}
							className="mt-3 inline-block text-sm text-primary hover:underline"
						>
							Browse projects
						</Link>
					</div>
				) : (
					<div className="space-y-3">
						{investments.map((inv) => {
							const p = inv.project as {
								slug: string;
								title_en: string;
								cover_images: string[];
								projected_irr_min: number;
								projected_irr_max: number;
								currency: string;
							} | null;
							return (
								<div
									key={inv.id}
									className="rounded-2xl border border-border bg-white p-5 flex items-center gap-4"
								>
									{p?.cover_images?.[0] ? (
										<img
											src={p.cover_images[0]}
											alt={p.title_en}
											className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
										/>
									) : (
										<div className="w-16 h-16 rounded-xl bg-primary/10 flex-shrink-0" />
									)}
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-text truncate">
											{p?.title_en ?? "—"}
										</p>
										<p className="text-xs text-muted mt-0.5">
											IRR: {p?.projected_irr_min}–{p?.projected_irr_max}%
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-text">{fmt(inv.amount)}</p>
										<span
											className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status] ?? "bg-gray-100 text-gray-700"}`}
										>
											{inv.status}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		);
	},
});
