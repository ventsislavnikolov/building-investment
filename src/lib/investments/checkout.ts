import { z } from "zod";
import {
  type AppLocale,
  defaultLocale,
  isSupportedLocale,
} from "@/lib/routing";

const amountSchema = z.number().finite().positive();

export type InvestmentCheckoutState = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
  errors?: {
    amount?: string;
  };
};

export const initialInvestmentCheckoutState: InvestmentCheckoutState = {
  ok: false,
};

export type CheckoutProviderResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string };

type CheckoutProviderFn = (input: {
  amount: number;
  locale: AppLocale;
  slug: string;
}) => Promise<CheckoutProviderResult>;

function resolveLocale(rawLocale: string | null): AppLocale {
  return rawLocale && isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;
}

function sanitizeCheckoutUrl(url: string, locale: AppLocale): string {
  if (!url.startsWith("/") || url.startsWith("//")) {
    return `/${locale}/dashboard/investments`;
  }

  if (!url.startsWith(`/${locale}/`)) {
    return `/${locale}/dashboard/investments`;
  }

  return url;
}

export async function createInvestmentCheckout(input: {
  amount: number;
  locale: AppLocale;
  slug: string;
}): Promise<CheckoutProviderResult> {
  const checkoutUrl = `/${input.locale}/dashboard/investments?checkout=started&project=${encodeURIComponent(input.slug)}&amount=${input.amount}`;
  return {
    checkoutUrl,
    ok: true,
  };
}

export async function processInvestmentCheckoutSubmission(
  formData: FormData,
  provider: CheckoutProviderFn,
): Promise<InvestmentCheckoutState> {
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const slug = String(formData.get("slug") ?? "").trim();
  const amountRaw = Number(formData.get("amount"));
  const minAmount = Number(formData.get("minAmount"));
  const maxAmount = Number(formData.get("maxAmount"));

  const parsedAmount = amountSchema.safeParse(amountRaw);
  if (!parsedAmount.success) {
    return {
      ok: false,
      message: "Please enter a valid amount",
      errors: {
        amount: "Amount must be a positive number",
      },
    };
  }

  if (parsedAmount.data < minAmount) {
    return {
      ok: false,
      message: "Please fix the highlighted fields",
      errors: {
        amount: `Amount must be at least €${minAmount.toFixed(0)}`,
      },
    };
  }

  if (Number.isFinite(maxAmount) && parsedAmount.data > maxAmount) {
    return {
      ok: false,
      message: "Please fix the highlighted fields",
      errors: {
        amount: `Amount must be no more than €${maxAmount.toFixed(0)}`,
      },
    };
  }

  if (!slug) {
    return {
      ok: false,
      message: "Project reference is missing",
    };
  }

  const providerResult = await provider({
    amount: parsedAmount.data,
    locale,
    slug,
  });

  if (!providerResult.ok) {
    return {
      ok: false,
      message: providerResult.error,
    };
  }

  return {
    ok: true,
    redirectTo: sanitizeCheckoutUrl(providerResult.checkoutUrl, locale),
  };
}
