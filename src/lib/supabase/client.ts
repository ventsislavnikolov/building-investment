import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { getRuntimeEnv } from "~/env";

export function createBrowserClient() {
	const env = getRuntimeEnv();
	return createSupabaseBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}
