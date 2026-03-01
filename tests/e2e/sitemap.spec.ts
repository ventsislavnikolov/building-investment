import { expect, test } from "@playwright/test";

test("sitemap.xml returns valid XML", async ({ request }) => {
	const res = await request.get("/api/sitemap.xml");
	expect(res.status()).toBe(200);
	expect(res.headers()["content-type"]).toContain("application/xml");
	const body = await res.text();
	expect(body).toContain("<?xml");
	expect(body).toContain("<urlset");
	expect(body).toContain("buildinginvestment.bg");
});
