import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AppShell } from "~/components/shell/app-shell";
import { getLocaleFromParams, localePath } from "~/lib/routing";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data: profile } = await supabase
		.from("profiles")
		.select("full_name, avatar_url, role")
		.eq("id", user.id)
		.maybeSingle();

	return { user, profile };
});

const logoutFn = createServerFn().handler(async () => {
	const supabase = createSupabaseServerClient();
	await supabase.auth.signOut();
});

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

		const session = await getSessionFn();
		if (!session) {
			throw redirect({ to: localePath(locale, "/login") });
		}

		return { locale, user: session.user, profile: session.profile };
	},
	component: function DashboardLayout() {
		const { locale, user, profile } = Route.useRouteContext();

		async function handleLogout() {
			await logoutFn();
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
