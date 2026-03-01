import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "~/components/shell/app-shell";
import { requireAdmin } from "~/lib/auth/guards";
import { getLocaleFromParams, localePath } from "~/lib/routing";

const ADMIN_NAV = (locale: string) => [
	{
		label: "Dashboard",
		icon: "layout-dashboard",
		href: localePath(locale as "en" | "bg", "/admin/dashboard"),
	},
	{
		label: "Projects",
		icon: "folder-open",
		href: localePath(locale as "en" | "bg", "/admin/projects"),
	},
	{
		label: "Investors",
		icon: "trending-up",
		href: localePath(locale as "en" | "bg", "/admin/investors"),
	},
	{
		label: "Investments",
		icon: "coins",
		href: localePath(locale as "en" | "bg", "/admin/investments"),
	},
	{
		label: "Budget",
		icon: "wallet",
		href: localePath(locale as "en" | "bg", "/admin/budget"),
	},
	{
		label: "Documents",
		icon: "folder-open",
		href: localePath(locale as "en" | "bg", "/admin/documents"),
	},
	{
		label: "Audit Log",
		icon: "arrow-left-right",
		href: localePath(locale as "en" | "bg", "/admin/audit"),
	},
	{
		label: "Metrics",
		icon: "trending-up",
		href: localePath(locale as "en" | "bg", "/admin/metrics"),
	},
];

const ADMIN_BOTTOM_NAV = (locale: string) => [
	{
		label: "Settings",
		icon: "settings",
		href: localePath(locale as "en" | "bg", "/dashboard/settings"),
	},
	{
		label: "Investor View",
		icon: "layout-dashboard",
		href: localePath(locale as "en" | "bg", "/dashboard"),
	},
];

export const Route = createFileRoute("/($locale)/admin/_layout")({
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

		const { data: profile } = await supabase
			.from("profiles")
			.select("full_name, avatar_url, role")
			.eq("id", user.id)
			.maybeSingle();

		requireAdmin(profile, locale);

		return { locale, user, profile };
	},
	component: function AdminLayout() {
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
				navItems={ADMIN_NAV(locale)}
				bottomNavItems={ADMIN_BOTTOM_NAV(locale)}
				userName={profile?.full_name ?? user.email}
				userEmail={user.email}
				userAvatar={profile?.avatar_url}
				onLogout={handleLogout}
				title="Admin"
			>
				<Outlet />
			</AppShell>
		);
	},
});
