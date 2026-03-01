import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";
import { z } from "zod";
import { getRuntimeEnv } from "~/env";
import { requireAuth } from "~/lib/auth/guards";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const checkoutSchema = z.object({
	projectId: z.string(),
	amount: z.number().positive(),
	locale: z.enum(["en", "bg"]),
});

export const createInvestmentCheckout = createServerFn({ method: "POST" })
	.inputValidator(checkoutSchema)
	.handler(async ({ data }) => {
		const supabase = createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const authedUser = requireAuth(user, data.locale);

		const { data: project } = await supabase
			.from("projects")
			.select(
				"id, slug, title_en, min_investment, max_investment, target_amount, funded_amount, status, currency",
			)
			.eq("id", data.projectId)
			.single();

		if (!project || project.status !== "fundraising") {
			throw new Error("Project not available for investment");
		}
		if (data.amount < project.min_investment) {
			throw new Error(`Amount below minimum of ${project.min_investment}`);
		}
		if (project.max_investment && data.amount > project.max_investment) {
			throw new Error("Amount above maximum");
		}

		const env = getRuntimeEnv();
		const stripe = new Stripe(env.STRIPE_SECRET_KEY);

		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: project.currency.toLowerCase(),
						product_data: { name: project.title_en },
						unit_amount: Math.round(data.amount * 100),
					},
					quantity: 1,
				},
			],
			metadata: {
				projectId: data.projectId,
				userId: authedUser.id,
				amount: data.amount.toString(),
			},
			success_url: `${env.APP_URL}/projects/${project.slug}/invest/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${env.APP_URL}/projects/${project.slug}/invest`,
		});

		if (!session.url) throw new Error("Stripe did not return a checkout URL");
		throw redirect({ href: session.url });
	});

const webhookSchema = z.object({
	signature: z.string(),
	body: z.string(),
});

export const handleStripeWebhook = createServerFn({ method: "POST" })
	.inputValidator(webhookSchema)
	.handler(async ({ data }) => {
		const env = getRuntimeEnv();
		const stripe = new Stripe(env.STRIPE_SECRET_KEY);

		let event: Stripe.Event;
		try {
			event = stripe.webhooks.constructEvent(
				data.body,
				data.signature,
				env.STRIPE_WEBHOOK_SECRET,
			);
		} catch {
			throw new Error("Webhook signature verification failed");
		}

		if (event.type === "checkout.session.completed") {
			const session = event.data.object as Stripe.Checkout.Session;
			const { projectId, userId, amount } = session.metadata ?? {};

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
		}

		return { received: true };
	});
