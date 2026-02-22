import { z } from "zod";
import type { AuthProviderResult } from "@/lib/auth/auth-provider";
import {
  type AppLocale,
  defaultLocale,
  isSupportedLocale,
} from "@/lib/routing";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginState = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
  errors?: {
    email?: string;
    password?: string;
  };
};

export const initialLoginState: LoginState = {
  ok: false,
};

type AuthProviderFn = (
  email: string,
  password: string,
) => Promise<AuthProviderResult>;

function resolveLocale(rawLocale: string | null): AppLocale {
  return rawLocale && isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;
}

function sanitizeNextPath(nextPath: string | null, locale: AppLocale): string {
  if (!nextPath) {
    return `/${locale}/dashboard`;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return `/${locale}/dashboard`;
  }

  if (!nextPath.startsWith(`/${locale}/`)) {
    return `/${locale}/dashboard`;
  }

  return nextPath;
}

export async function processLoginSubmission(
  formData: FormData,
  authProvider: AuthProviderFn,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const nextPath = String(formData.get("next") ?? "");

  const validated = loginSchema.safeParse({
    email,
    password,
  });

  if (!validated.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields",
      errors: {
        email: validated.error.flatten().fieldErrors.email?.[0],
        password: validated.error.flatten().fieldErrors.password?.[0],
      },
    };
  }

  const authResult = await authProvider(
    validated.data.email,
    validated.data.password,
  );

  if (!authResult.ok) {
    return {
      ok: false,
      message: authResult.error,
    };
  }

  return {
    ok: true,
    redirectTo: sanitizeNextPath(nextPath, locale),
  };
}
