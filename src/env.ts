import { z } from "zod";

const envSchema = z.object({
	SUPABASE_URL: z.string().url(),
	SUPABASE_ANON_KEY: z.string().min(1),
	SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
	APP_URL: z.string().url(),
	STRIPE_PUBLISHABLE_KEY: z.string().optional(),
	STRIPE_SECRET_KEY: z.string().optional(),
	STRIPE_WEBHOOK_SECRET: z.string().optional(),
	SUMSUB_APP_TOKEN: z.string().optional(),
	SUMSUB_SECRET_KEY: z.string().optional(),
	RESEND_API_KEY: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(source: Record<string, string | undefined>): AppEnv {
	const parsed = envSchema.safeParse(source);
	if (!parsed.success)
		throw new Error("Missing or invalid environment variables");
	return parsed.data;
}

let cached: AppEnv | null = null;
export function getRuntimeEnv(): AppEnv {
	if (!cached)
		cached = getEnv(process.env as Record<string, string | undefined>);
	return cached;
}
