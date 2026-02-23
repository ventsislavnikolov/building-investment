"use server";

import { redirect } from "next/navigation";
import {
  signInWithEmailPassword,
  signUpWithEmailPassword,
} from "@/lib/auth/auth-provider";
import { type LoginState, processLoginSubmission } from "@/lib/auth/login";
import {
  processRegisterSubmission,
  type RegisterState,
} from "@/lib/auth/register";

export async function loginActionState(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = await processLoginSubmission(
    formData,
    signInWithEmailPassword,
  );

  if (result.ok && result.redirectTo) {
    redirect(result.redirectTo);
  }

  return result;
}

export async function registerActionState(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const result = await processRegisterSubmission(
    formData,
    signUpWithEmailPassword,
  );

  if (result.ok && result.redirectTo) {
    redirect(result.redirectTo);
  }

  return result;
}
