import { defaultLocale, isSupportedLocale, type Locale } from "~/lib/i18n";

export function getLocaleFromParams(param: string | undefined): Locale {
	if (!param) return defaultLocale;
	return isSupportedLocale(param) ? param : defaultLocale;
}

export function localePath(locale: Locale, path: string): string {
	if (locale === "en") return path;
	return `/${locale}${path}`;
}
