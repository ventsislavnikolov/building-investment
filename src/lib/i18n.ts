import { type AppLocale, defaultLocale } from "@/lib/routing";
import bg from "@/messages/bg.json";
import en from "@/messages/en.json";

const dictionaries = {
  en,
  bg,
} as const;

export function t(locale: AppLocale, key: string): string {
  const dictionary = dictionaries[locale] ?? dictionaries[defaultLocale];
  const safeDictionary = dictionary as Record<string, string>;
  const safeDefault = dictionaries[defaultLocale] as Record<string, string>;

  return safeDictionary[key] ?? safeDefault[key] ?? key;
}
