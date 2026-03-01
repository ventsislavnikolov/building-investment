import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import { getRuntimeEnv } from "~/env";

export function createSupabaseServerClient() {
	const env = getRuntimeEnv();
	return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				const cookies = getCookies();
				return Object.entries(cookies).map(([name, value]) => ({
					name,
					value,
				}));
			},
			setAll(cookies) {
				for (const { name, value, options } of cookies) {
					setCookie(name, value, options);
				}
			},
		},
	});
}
