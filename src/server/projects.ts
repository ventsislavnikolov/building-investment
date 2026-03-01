import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const PUBLISHED_STATUSES = [
	"fundraising",
	"funded",
	"in_execution",
	"exiting",
	"completed",
] as const;

const catalogSchema = z.object({
	locale: z.enum(["en", "bg"]),
	search: z.string().default(""),
	strategy: z.string().default("all"),
	sort: z.enum(["featured", "funded_desc", "irr_desc"]).default("featured"),
	page: z.number().default(1),
});

const PROJECT_SELECT = `
  id, slug, title_bg, title_en, description_bg, description_en,
  strategy, status, city, district, property_type,
  target_amount, min_investment, funded_amount, investor_count,
  projected_irr_min, projected_irr_max, projected_roi_min, projected_roi_max,
  fundraise_start, fundraise_end, cover_images, risk_score,
  estimated_duration_months, currency
`;

function mapProject(p: Record<string, unknown>, locale: "en" | "bg") {
	const targetAmount = (p.target_amount as number) ?? 0;
	const fundedAmount = (p.funded_amount as number) ?? 0;
	return {
		...p,
		title: locale === "bg" ? p.title_bg : p.title_en,
		description: locale === "bg" ? p.description_bg : p.description_en,
		fundedPct:
			targetAmount > 0 ? Math.round((fundedAmount / targetAmount) * 100) : 0,
	};
}

export const getPublishedProjects = createServerFn({ method: "GET" })
	.validator(catalogSchema)
	.handler(async ({ data }) => {
		const supabase = createSupabaseServerClient();
		let query = supabase
			.from("projects")
			.select(PROJECT_SELECT)
			.in("status", [...PUBLISHED_STATUSES]);

		if (data.search) {
			query = query.or(
				`title_en.ilike.%${data.search}%,title_bg.ilike.%${data.search}%,city.ilike.%${data.search}%`,
			);
		}
		if (data.strategy !== "all") {
			query = query.eq("strategy", data.strategy);
		}

		const { data: projects, error } = await query;
		if (error) throw new Error(error.message);

		return (projects ?? []).map((p: Record<string, unknown>) =>
			mapProject(p, data.locale),
		);
	});

export const getProjectBySlug = createServerFn({ method: "GET" })
	.validator(z.object({ slug: z.string(), locale: z.enum(["en", "bg"]) }))
	.handler(async ({ data }) => {
		const supabase = createSupabaseServerClient();
		const { data: project, error } = await supabase
			.from("projects")
			.select(`*, milestones(*), documents(id, title, category, is_public)`)
			.eq("slug", data.slug)
			.in("status", [...PUBLISHED_STATUSES])
			.maybeSingle();

		if (error || !project) return null;
		return mapProject(project as Record<string, unknown>, data.locale);
	});
