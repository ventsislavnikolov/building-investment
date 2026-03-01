import { createAPIFileRoute } from "@tanstack/react-start/api";
import Stripe from "stripe";
import { getRuntimeEnv } from "~/env";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";
import { sendInvestmentConfirmedEmail } from "~/server/notifications";

export const APIRoute = createAPIFileRoute("/api/webhooks/stripe")({
	POST: async ({ request }) => {
		const env = getRuntimeEnv();
		const stripe = new Stripe(env.STRIPE_SECRET_KEY);
		const sig = request.headers.get("stripe-signature");

		if (!sig) {
			return new Response("Missing stripe-signature header", { status: 400 });
		}

		const body = await request.text();

		let event: Stripe.Event;
		try {
			event = stripe.webhooks.constructEvent(
				body,
				sig,
				env.STRIPE_WEBHOOK_SECRET,
			);
		} catch {
			return new Response("Webhook signature verification failed", {
				status: 400,
			});
		}

		if (event.type === "checkout.session.completed") {
			const session = event.data.object as Stripe.CheckoutSession;
			const { projectId, userId, amount } = session.metadata ?? {};

			if (projectId && userId && amount) {
				const supabase = createSupabaseAdminClient();
				await supabase.from("investments").insert({
					investor_id: userId,
					project_id: projectId,
					amount: Number.parseFloat(amount),
					status: "active",
					stripe_payment_intent_id: session.payment_intent as string,
					paid_at: new Date().toISOString(),
					terms_accepted: true,
					terms_accepted_at: new Date().toISOString(),
				});

				// Send confirmation email
				const [profileRes, projectRes] = await Promise.all([
					supabase
						.from("profiles")
						.select("full_name")
						.eq("id", userId)
						.maybeSingle(),
					supabase
						.from("projects")
						.select("title_en, currency")
						.eq("id", projectId)
						.maybeSingle(),
				]);
				const investorEmail = session.customer_details?.email ?? "";
				if (investorEmail) {
					sendInvestmentConfirmedEmail({
						to: investorEmail,
						investorName: profileRes.data?.full_name ?? "Investor",
						projectTitle: projectRes.data?.title_en ?? "the project",
						amount: Number.parseFloat(amount),
						currency: projectRes.data?.currency ?? "EUR",
					}).catch(() => null);
				}
			}
		}

		return new Response("ok", { status: 200 });
	},
});
