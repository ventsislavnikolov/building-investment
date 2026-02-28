import { redirect } from "@tanstack/react-router";
import type { Locale } from "~/lib/i18n";
import { localePath } from "~/lib/routing";

export function requireAuth<T extends { id: string }>(
	user: T | null,
	locale: Locale,
): T {
	if (!user) {
		throw redirect({ to: localePath(locale, "/login") });
	}
	return user;
}

export function requireAdmin<T extends { id: string; role: string }>(
	profile: T | null,
	locale: Locale,
): T {
	if (!profile || !["admin", "project_owner"].includes(profile.role)) {
		throw redirect({ to: localePath(locale, "/dashboard") });
	}
	return profile;
}
