import { createAPIFileRoute } from "@tanstack/react-start/api";
import { handleSumsubWebhook } from "~/server/kyc";

export const APIRoute = createAPIFileRoute("/api/webhooks/sumsub")({
	POST: async ({ request }) => {
		const sig = request.headers.get("x-payload-digest");
		if (!sig) {
			return new Response("Missing x-payload-digest header", { status: 400 });
		}
		const body = await request.text();
		return handleSumsubWebhook(body, sig);
	},
});
