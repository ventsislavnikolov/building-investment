import { createBrowserClient } from "@supabase/ssr";
import { getRuntimeEnv } from "@/env";

export function createSupabaseBrowserClient() {
  const env = getRuntimeEnv();

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
