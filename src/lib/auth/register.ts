import { z } from "zod";
import type { RegisterProviderResult } from "@/lib/auth/auth-provider";
import {
  type AppLocale,
  defaultLocale,
  isSupportedLocale,
} from "@/lib/routing";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterState = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

export const initialRegisterState: RegisterState = {
  ok: false,
};

type RegisterAuthProviderFn = (input: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) => Promise<RegisterProviderResult>;

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

export async function processRegisterSubmission(
  formData: FormData,
  authProvider: RegisterAuthProviderFn,
): Promise<RegisterState> {
  const firstName = String(formData.get("firstName") ?? "");
  const lastName = String(formData.get("lastName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const nextPath = String(formData.get("next") ?? "");

  const validated = registerSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });

  if (!validated.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields",
      errors: {
        firstName: validated.error.flatten().fieldErrors.firstName?.[0],
        lastName: validated.error.flatten().fieldErrors.lastName?.[0],
        email: validated.error.flatten().fieldErrors.email?.[0],
        password: validated.error.flatten().fieldErrors.password?.[0],
        confirmPassword:
          validated.error.flatten().fieldErrors.confirmPassword?.[0],
      },
    };
  }

  const authResult = await authProvider({
    email: validated.data.email,
    firstName: validated.data.firstName,
    lastName: validated.data.lastName,
    password: validated.data.password,
  });

  if (!authResult.ok) {
    return {
      ok: false,
      message: authResult.error,
    };
  }

  if (!authResult.sessionCreated) {
    return {
      ok: true,
      message: "Check your email to confirm your account.",
    };
  }

  return {
    ok: true,
    redirectTo: sanitizeNextPath(nextPath, locale),
  };
}
