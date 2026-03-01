import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MarketingFooter } from "~/components/marketing/footer";
import { MarketingNav } from "~/components/marketing/nav";
import { getLocaleFromParams } from "~/lib/routing";

export const Route = createFileRoute("/($locale)/_marketing")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function MarketingLayout() {
		const { locale } = Route.useRouteContext();
		return (
			<div className="flex flex-col min-h-screen">
				<MarketingNav locale={locale} />
				<main className="flex-1">
					<Outlet />
				</main>
				<MarketingFooter locale={locale} />
			</div>
		);
	},
});
