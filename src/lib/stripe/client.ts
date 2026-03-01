import Stripe from "stripe";
import { getRuntimeEnv } from "~/env";

let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
	if (!stripeInstance) {
		const env = getRuntimeEnv();
		if (!env.STRIPE_SECRET_KEY)
			throw new Error("STRIPE_SECRET_KEY is not configured");
		stripeInstance = new Stripe(env.STRIPE_SECRET_KEY);
	}
	return stripeInstance;
}
