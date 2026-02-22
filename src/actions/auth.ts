"use server";

import { redirect } from "next/navigation";
import { signInWithEmailPassword } from "@/lib/auth/auth-provider";
import { type LoginState, processLoginSubmission } from "@/lib/auth/login";

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
