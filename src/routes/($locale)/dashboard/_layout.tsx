import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "~/components/shell/app-shell";
import { getLocaleFromParams, localePath } from "~/lib/routing";

const DASHBOARD_NAV = (locale: string) => [
	{
		label: "Overview",
		icon: "layout-dashboard",
		href: localePath(locale as "en" | "bg", "/dashboard"),
	},
	{
		label: "My Investments",
		icon: "coins",
		href: localePath(locale as "en" | "bg", "/dashboard/investments"),
	},
	{
		label: "Portfolio",
		icon: "trending-up",
		href: localePath(locale as "en" | "bg", "/dashboard/portfolio"),
	},
	{
		label: "Wallet",
		icon: "wallet",
		href: localePath(locale as "en" | "bg", "/dashboard/wallet"),
	},
	{
		label: "Transactions",
		icon: "arrow-left-right",
		href: localePath(locale as "en" | "bg", "/dashboard/transactions"),
	},
	{
		label: "Favorites",
		icon: "heart",
		href: localePath(locale as "en" | "bg", "/dashboard/favorites"),
	},
	{
		label: "Documents",
		icon: "folder-open",
		href: localePath(locale as "en" | "bg", "/dashboard/documents"),
	},
	{
		label: "Notifications",
		icon: "bell",
		href: localePath(locale as "en" | "bg", "/dashboard/notifications"),
	},
];

const DASHBOARD_BOTTOM_NAV = (locale: string) => [
	{
		label: "Settings",
		icon: "settings",
		href: localePath(locale as "en" | "bg", "/dashboard/settings"),
	},
	{
		label: "Help",
		icon: "help-circle",
		href: localePath(locale as "en" | "bg", "/help"),
	},
];

export const Route = createFileRoute("/($locale)/dashboard/_layout")({
	beforeLoad: async ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);

		const { createSupabaseServerClient } = await import(
			"~/lib/supabase/server"
		);
		const supabase = createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			throw redirect({ to: localePath(locale, "/login") });
		}

		// Fetch profile for display name
		const { data: profile } = await supabase
			.from("profiles")
			.select("full_name, avatar_url, role")
			.eq("id", user.id)
			.maybeSingle();

		return { locale, user, profile };
	},
	component: function DashboardLayout() {
		const { locale, user, profile } = Route.useRouteContext();

		async function handleLogout() {
			const { createSupabaseServerClient } = await import(
				"~/lib/supabase/server"
			);
			const supabase = createSupabaseServerClient();
			await supabase.auth.signOut();
			window.location.href = localePath(locale, "/login");
		}

		return (
			<AppShell
				navItems={DASHBOARD_NAV(locale)}
				bottomNavItems={DASHBOARD_BOTTOM_NAV(locale)}
				userName={profile?.full_name ?? user.email}
				userEmail={user.email}
				userAvatar={profile?.avatar_url}
				onLogout={handleLogout}
			>
				<Outlet />
			</AppShell>
		);
	},
});
