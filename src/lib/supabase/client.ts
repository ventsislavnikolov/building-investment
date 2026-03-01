import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

export function createBrowserClient() {
	const url = import.meta.env.VITE_SUPABASE_URL as string;
	const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
	if (!url || !key)
		throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
	return createSupabaseBrowserClient(url, key);
}
