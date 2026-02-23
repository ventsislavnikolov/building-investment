"use server";

import { redirect } from "next/navigation";
import {
  createInvestmentCheckout,
  type InvestmentCheckoutState,
  processInvestmentCheckoutSubmission,
} from "@/lib/investments/checkout";

export async function investmentCheckoutAction(
  _previousState: InvestmentCheckoutState,
  formData: FormData,
): Promise<InvestmentCheckoutState> {
  const result = await processInvestmentCheckoutSubmission(
    formData,
    createInvestmentCheckout,
  );

  if (result.ok && result.redirectTo) {
    redirect(result.redirectTo);
  }

  return result;
}
