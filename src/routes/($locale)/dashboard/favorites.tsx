import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Heart } from "lucide-react";
import { localePath } from "~/lib/routing";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getFavorites = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthenticated");

	const { data } = await supabase
		.from("favorites")
		.select(
			"id, project:projects(id, slug, title_en, cover_images, projected_irr_min, projected_irr_max, min_investment, currency, status)",
		)
		.eq("user_id", user.id);

	return data ?? [];
});

function fmt(n: number, currency = "EUR") {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(n);
}

export const Route = createFileRoute("/($locale)/dashboard/favorites")({
	loader: async () => {
		const favorites = await getFavorites();
		return { favorites };
	},
	component: function FavoritesPage() {
		const { locale } = Route.useRouteContext();
		const { favorites } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-5xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Favorites</h1>
					<p className="text-muted mt-1">Saved projects</p>
				</div>

				{favorites.length === 0 ? (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<Heart className="w-10 h-10 text-muted mx-auto mb-3" />
						<p className="text-text font-medium">No saved projects</p>
						<Link
							to={localePath(locale, "/projects")}
							className="mt-3 inline-block text-sm text-primary hover:underline"
						>
							Browse projects
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{favorites.map((fav) => {
							const p = fav.project as {
								slug: string;
								title_en: string;
								cover_images: string[];
								projected_irr_min: number;
								projected_irr_max: number;
								min_investment: number;
								currency: string;
							} | null;
							if (!p) return null;
							return (
								<Link
									key={fav.id}
									to={localePath(locale, `/projects/${p.slug}`)}
									className="rounded-2xl border border-border bg-white overflow-hidden hover:border-primary transition-colors"
								>
									{p.cover_images?.[0] ? (
										<img
											src={p.cover_images[0]}
											alt={p.title_en}
											className="w-full h-40 object-cover"
										/>
									) : (
										<div className="w-full h-40 bg-primary/10" />
									)}
									<div className="p-4">
										<p className="font-semibold text-text truncate">
											{p.title_en}
										</p>
										<p className="text-xs text-muted mt-1">
											IRR {p.projected_irr_min}–{p.projected_irr_max}% · Min{" "}
											{fmt(p.min_investment, p.currency)}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		);
	},
});
