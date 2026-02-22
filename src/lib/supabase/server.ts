import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getRuntimeEnv } from "@/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getRuntimeEnv();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const cookie of cookiesToSet) {
              cookieStore.set(cookie.name, cookie.value, cookie.options);
            }
          } catch {
            // Ignore set failures in read-only contexts (e.g. Server Components).
          }
        },
      },
    },
  );
}
