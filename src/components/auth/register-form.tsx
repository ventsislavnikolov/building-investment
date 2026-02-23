"use client";

import { useActionState } from "react";
import { registerActionState } from "@/actions/auth";
import { initialRegisterState, type RegisterState } from "@/lib/auth/register";
import { t } from "@/lib/i18n";
import type { AppLocale } from "@/lib/routing";

type RegisterFormProps = {
  locale: AppLocale;
  next: string;
};

function fieldError(
  key: keyof NonNullable<RegisterState["errors"]>,
  state: RegisterState,
) {
  return state.errors?.[key];
}

export function RegisterForm({ locale, next }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(
    registerActionState,
    initialRegisterState,
  );

  return (
    <form action={formAction} className="mt-10 max-w-xl space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next} />

      {state.message ? (
        <p
          className={`max-w-xl rounded-xl border px-4 py-3 text-sm ${
            state.ok
              ? "border-accent/25 bg-accent/10 text-[#174f3d]"
              : "border-[#9f4f28]/20 bg-[#9f4f28]/10 text-[#7a3a1f]"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-foreground">
          {t(locale, "register.firstName")}
          <input
            type="text"
            name="firstName"
            autoComplete="given-name"
            required
            className="mt-2 w-full rounded-xl border border-foreground/20 bg-white/70 px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
          />
          {fieldError("firstName", state) ? (
            <span className="mt-2 block text-xs text-[#7a3a1f]">
              {fieldError("firstName", state)}
            </span>
          ) : null}
        </label>

        <label className="block text-sm font-semibold text-foreground">
          {t(locale, "register.lastName")}
          <input
            type="text"
            name="lastName"
            autoComplete="family-name"
            required
            className="mt-2 w-full rounded-xl border border-foreground/20 bg-white/70 px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
          />
          {fieldError("lastName", state) ? (
            <span className="mt-2 block text-xs text-[#7a3a1f]">
              {fieldError("lastName", state)}
            </span>
          ) : null}
        </label>
      </div>

      <label className="block text-sm font-semibold text-foreground">
        {t(locale, "register.email")}
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-xl border border-foreground/20 bg-white/70 px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
          placeholder="investor@example.com"
        />
        {fieldError("email", state) ? (
          <span className="mt-2 block text-xs text-[#7a3a1f]">
            {fieldError("email", state)}
          </span>
        ) : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-foreground">
          {t(locale, "register.password")}
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-2 w-full rounded-xl border border-foreground/20 bg-white/70 px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
            placeholder="At least 8 characters"
          />
          {fieldError("password", state) ? (
            <span className="mt-2 block text-xs text-[#7a3a1f]">
              {fieldError("password", state)}
            </span>
          ) : null}
        </label>

        <label className="block text-sm font-semibold text-foreground">
          {t(locale, "register.confirmPassword")}
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-2 w-full rounded-xl border border-foreground/20 bg-white/70 px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
            placeholder="Repeat password"
          />
          {fieldError("confirmPassword", state) ? (
            <span className="mt-2 block text-xs text-[#7a3a1f]">
              {fieldError("confirmPassword", state)}
            </span>
          ) : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-[0.08em] text-accent-foreground uppercase transition hover:translate-y-[-1px] hover:bg-[#174f3d] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending
          ? `${t(locale, "register.submit")}...`
          : t(locale, "register.submit")}
      </button>
    </form>
  );
}
