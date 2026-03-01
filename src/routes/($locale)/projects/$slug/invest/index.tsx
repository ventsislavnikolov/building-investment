import {
	createFileRoute,
	Link,
	notFound,
	redirect,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AmountSelector } from "~/components/invest/amount-selector";
import { BillingSummary } from "~/components/invest/billing-summary";
import { getLocaleFromParams, localePath } from "~/lib/routing";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const checkAuthFn = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user ? { userId: user.id } : null;
});

export const Route = createFileRoute("/($locale)/projects/$slug/invest/")({
	beforeLoad: async ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		const auth = await checkAuthFn();
		if (!auth) {
			throw redirect({ to: localePath(locale, "/login") });
		}
		return { locale, userId: auth.userId };
	},
	loader: async ({ params, context }) => {
		const { getProjectBySlug } = await import("~/server/projects");
		const project = await getProjectBySlug({
			slug: params.slug,
			locale: context.locale,
		});
		if (!project) throw notFound();
		return { project };
	},
	notFoundComponent: () => (
		<div className="flex min-h-screen items-center justify-center">
			<p className="text-muted">Project not found.</p>
		</div>
	),
	component: function InvestPage() {
		const { locale } = Route.useRouteContext();
		const { project } = Route.useLoaderData();
		const p = project as Record<string, unknown> & {
			title: string;
			city: string;
			slug: string;
			min_investment: number;
			target_amount: number;
			funded_amount: number;
			projected_irr_min: number;
			projected_irr_max: number;
			currency: string;
			cover_images: string[];
		};

		const remaining = p.target_amount - p.funded_amount;
		const maxAmount = Math.min(remaining, p.target_amount);

		const [amount, setAmount] = useState(p.min_investment);
		const [termsAccepted, setTermsAccepted] = useState(false);
		const [isSubmitting, setIsSubmitting] = useState(false);

		async function handleSubmit() {
			if (amount < p.min_investment || !termsAccepted) return;
			setIsSubmitting(true);
			try {
				const { createInvestmentCheckout } = await import(
					"~/server/investments"
				);
				await createInvestmentCheckout({
					projectId: p.id as string,
					amount,
					locale,
				});
			} catch {
				setIsSubmitting(false);
			}
		}

		return (
			<div className="min-h-screen bg-[#f8f9fa]">
				{/* Standalone header */}
				<header className="bg-white border-b border-border px-4 sm:px-8 py-4 flex items-center gap-4">
					<Link
						to={localePath(locale, `/projects/${p.slug}`)}
						className="text-sm text-muted hover:text-text transition-colors"
						aria-label="back to project"
					>
						← Back to project
					</Link>
					<span className="text-sm font-semibold text-text ml-auto">
						Secure Checkout
					</span>
				</header>

				<main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
					<h1 className="text-2xl font-bold text-text mb-8">
						Invest in {p.title}
					</h1>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,380px]">
						{/* Left: amount selector */}
						<div className="rounded-2xl border border-border bg-white p-6">
							<h2 className="text-lg font-semibold text-text mb-5">
								Investment amount
							</h2>
							<AmountSelector
								amount={amount}
								minAmount={p.min_investment}
								maxAmount={maxAmount}
								currency={p.currency}
								onChange={setAmount}
							/>
						</div>

						{/* Right: billing summary */}
						<BillingSummary
							project={{
								title: p.title,
								city: p.city,
								coverImage: p.cover_images?.[0],
								projected_irr_min: p.projected_irr_min,
								projected_irr_max: p.projected_irr_max,
								min_investment: p.min_investment,
								currency: p.currency,
							}}
							amount={amount}
							termsAccepted={termsAccepted}
							onTermsChange={setTermsAccepted}
							onSubmit={handleSubmit}
							isSubmitting={isSubmitting}
							locale={locale}
						/>
					</div>
				</main>
			</div>
		);
	},
});
