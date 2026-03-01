import { createClient } from "@supabase/supabase-js";
import { getRuntimeEnv } from "~/env";

export function createSupabaseAdminClient() {
	const env = getRuntimeEnv();
	if (!env.SUPABASE_SERVICE_ROLE_KEY)
		throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
	return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false },
	});
}
