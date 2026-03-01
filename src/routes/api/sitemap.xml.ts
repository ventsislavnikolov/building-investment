import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const BASE_URL = "https://app.buildinginvestment.bg";

const STATIC_PATHS = [
	"/",
	"/projects",
	"/how-it-works",
	"/about",
	"/login",
	"/register",
	"/bg/",
	"/bg/projects",
	"/bg/how-it-works",
	"/bg/about",
];

export const APIRoute = createAPIFileRoute("/api/sitemap.xml")({
	GET: async () => {
		const supabase = createSupabaseAdminClient();
		const { data: projects } = await supabase
			.from("projects")
			.select("slug, updated_at")
			.in("status", [
				"fundraising",
				"funded",
				"in_execution",
				"exiting",
				"completed",
			]);

		const staticUrls = STATIC_PATHS.map(
			(path) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`,
		).join("");

		const projectUrls = (projects ?? [])
			.map(
				(p) => `
  <url>
    <loc>${BASE_URL}/projects/${p.slug}</loc>
    <lastmod>${p.updated_at?.split("T")[0] ?? new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`,
			)
			.join("");

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${projectUrls}
</urlset>`;

		return new Response(xml, {
			headers: { "Content-Type": "application/xml; charset=utf-8" },
		});
	},
});
