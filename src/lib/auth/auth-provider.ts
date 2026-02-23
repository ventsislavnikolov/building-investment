import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthProviderResult = { ok: true } | { ok: false; error: string };
export type RegisterProviderResult =
  | { ok: true; sessionCreated: boolean }
  | { ok: false; error: string };

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

export async function signUpWithEmailPassword(input: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<RegisterProviderResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  return {
    ok: true,
    sessionCreated: Boolean(data.session),
  };
}
