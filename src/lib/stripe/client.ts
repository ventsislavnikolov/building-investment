import Stripe from "stripe";
import { getRuntimeEnv } from "~/env";

let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
	if (!stripeInstance) {
		const env = getRuntimeEnv();
		stripeInstance = new Stripe(env.STRIPE_SECRET_KEY);
	}
	return stripeInstance;
}
