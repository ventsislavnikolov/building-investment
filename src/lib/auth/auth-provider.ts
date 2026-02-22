import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthProviderResult = { ok: true } | { ok: false; error: string };

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthProviderResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (!error) {
    return { ok: true };
  }

  return {
    ok: false,
    error: error.message,
  };
}
