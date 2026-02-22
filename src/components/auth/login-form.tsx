"use client";

import { useActionState } from "react";
import { loginActionState } from "@/actions/auth";
import { initialLoginState, type LoginState } from "@/lib/auth/login";
import { t } from "@/lib/i18n";
import type { AppLocale } from "@/lib/routing";

type LoginFormProps = {
  locale: AppLocale;
  next: string;
  initialError?: string;
};

function resolveInitialState(initialError?: string): LoginState {
  if (!initialError) {
    return initialLoginState;
  }

  return {
    ok: false,
    message: initialError,
  };
}

export function LoginForm({ locale, next, initialError }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    loginActionState,
    resolveInitialState(initialError),
  );

  return (
    <form action={formAction} className="mt-10 max-w-md space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next} />

      {state.message ? (
        <p className="max-w-md rounded-xl border border-[#9f4f28]/20 bg-[#9f4f28]/10 px-4 py-3 text-sm text-[#7a3a1f]">
          {state.message}
        </p>
      ) : null}

      <label className="block text-sm font-semibold text-foreground">
        {t(locale, "login.email")}
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-xl border border-foreground/20 bg-white/70 px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
          placeholder="investor@example.com"
        />
        {state.errors?.email ? (
          <span className="mt-2 block text-xs text-[#7a3a1f]">
            {state.errors.email}
          </span>
        ) : null}
      </label>

      <label className="block text-sm font-semibold text-foreground">
        {t(locale, "login.password")}
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="mt-2 w-full rounded-xl border border-foreground/20 bg-white/70 px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
          placeholder="At least 8 characters"
        />
        {state.errors?.password ? (
          <span className="mt-2 block text-xs text-[#7a3a1f]">
            {state.errors.password}
          </span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-[0.08em] text-accent-foreground uppercase transition hover:translate-y-[-1px] hover:bg-[#174f3d] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending
          ? `${t(locale, "login.submit")}...`
          : t(locale, "login.submit")}
      </button>
    </form>
  );
}
