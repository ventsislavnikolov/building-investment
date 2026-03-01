import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MarketingFooter } from "~/components/marketing/footer";
import { MarketingNav } from "~/components/marketing/nav";
import type { ProjectCardData } from "~/components/projects/project-card";
import { ProjectFilterBar } from "~/components/projects/project-filter-bar";
import { ProjectGrid } from "~/components/projects/project-grid";
import { getLocaleFromParams } from "~/lib/routing";

export const Route = createFileRoute("/($locale)/projects/")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	loader: async ({ context }) => {
		const { getPublishedProjects } = await import("~/server/projects");
		const projects = await getPublishedProjects({
			locale: context.locale,
			search: "",
			strategy: "all",
			sort: "featured",
			page: 1,
		});
		return { projects };
	},
	component: function ProjectsPage() {
		const { locale } = Route.useRouteContext();
		const { projects: initialProjects } = Route.useLoaderData();
		const [search, setSearch] = useState("");
		const [strategy, setStrategy] = useState("all");
		const [sort, setSort] = useState("featured");

		// Client-side filter from loaded data
		const filtered = (initialProjects as ProjectCardData[]).filter((p) => {
			const matchesSearch =
				!search ||
				p.title.toLowerCase().includes(search.toLowerCase()) ||
				p.city.toLowerCase().includes(search.toLowerCase());
			const matchesStrategy = strategy === "all" || p.strategy === strategy;
			return matchesSearch && matchesStrategy;
		});

		return (
			<div className="flex flex-col min-h-screen">
				<MarketingNav locale={locale} />
				<main className="flex-1 bg-[#f8f9fa] py-8 sm:py-12">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-text mb-1">
								Investment Projects
							</h1>
							<p className="text-muted">
								Discover curated real estate opportunities in Bulgaria
							</p>
						</div>

						<div className="mb-6">
							<ProjectFilterBar
								total={(initialProjects as ProjectCardData[]).length}
								shown={filtered.length}
								search={search}
								strategy={strategy}
								sort={sort}
								onSearch={setSearch}
								onStrategy={setStrategy}
								onSort={setSort}
								onOpenFilter={() => {}}
							/>
						</div>

						<ProjectGrid projects={filtered} locale={locale} />
					</div>
				</main>
				<MarketingFooter locale={locale} />
			</div>
		);
	},
});
