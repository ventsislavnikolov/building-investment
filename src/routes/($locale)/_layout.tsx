import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getLocaleFromParams } from "~/lib/routing";

export const Route = createFileRoute("/($locale)/_layout")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function LocaleLayout() {
		return <Outlet />;
	},
});
