"use client";

import { useActionState } from "react";
import { investmentCheckoutAction } from "@/actions/investments";
import { t } from "@/lib/i18n";
import {
  type InvestmentCheckoutState,
  initialInvestmentCheckoutState,
} from "@/lib/investments/checkout";
import type { AppLocale } from "@/lib/routing";

type InvestFormProps = {
  locale: AppLocale;
  maxAmount: number;
  minAmount: number;
  slug: string;
};

function resolveInitialState(): InvestmentCheckoutState {
  return initialInvestmentCheckoutState;
}

export function InvestForm({
  locale,
  maxAmount,
  minAmount,
  slug,
}: InvestFormProps) {
  const [state, formAction, isPending] = useActionState(
    investmentCheckoutAction,
    resolveInitialState(),
  );

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="slug" value={slug} />

      {state.message ? (
        <p className="max-w-xl rounded-xl border border-[#9f4f28]/20 bg-[#9f4f28]/10 px-4 py-3 text-sm text-[#7a3a1f]">
          {state.message}
        </p>
      ) : null}

      <label className="block text-sm font-semibold text-foreground">
        {t(locale, "projects.invest.amount")}
        <input
          type="number"
          name="amount"
          min={minAmount}
          max={maxAmount}
          step={100}
          required
          className="mt-2 w-full rounded-xl border border-foreground/20 bg-white/70 px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
          placeholder={minAmount.toFixed(0)}
        />
        {state.errors?.amount ? (
          <span className="mt-2 block text-xs text-[#7a3a1f]">
            {state.errors.amount}
          </span>
        ) : null}
      </label>

      <p className="text-sm text-muted">
        {t(locale, "projects.invest.range")} €{minAmount.toFixed(0)} - €
        {maxAmount.toFixed(0)}
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-[0.08em] text-accent-foreground uppercase transition hover:translate-y-[-1px] hover:bg-[#174f3d] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending
          ? `${t(locale, "projects.invest.submit")}...`
          : t(locale, "projects.invest.submit")}
      </button>
    </form>
  );
}
