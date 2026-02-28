import bg from "~/messages/bg.json";
import en from "~/messages/en.json";

export type Locale = "en" | "bg";
export const locales: Locale[] = ["en", "bg"];
export const defaultLocale: Locale = "en";

type Messages = typeof en;

const messages: Record<Locale, Messages> = { en, bg };

export function t(locale: Locale, key: string): string {
	const parts = key.split(".");
	let value: unknown = messages[locale] ?? messages.en;
	for (const part of parts) {
		if (typeof value !== "object" || value === null) return key;
		value = (value as Record<string, unknown>)[part];
	}
	return typeof value === "string" ? value : key;
}

export function isSupportedLocale(value: unknown): value is Locale {
	return value === "en" || value === "bg";
}
