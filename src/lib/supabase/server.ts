import { createServerClient } from "@supabase/ssr";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { getRuntimeEnv } from "~/env";

export function createSupabaseServerClient() {
	const env = getRuntimeEnv();
	return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				const all: Array<{ name: string; value: string }> = [];
				const token = getCookie("sb-auth-token");
				if (token) all.push({ name: "sb-auth-token", value: token });
				return all;
			},
			setAll(cookies) {
				for (const { name, value, options } of cookies) {
					setCookie(name, value, options);
				}
			},
		},
	});
}
