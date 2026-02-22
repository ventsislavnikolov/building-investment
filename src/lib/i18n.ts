import { type AppLocale, defaultLocale } from "@/lib/routing";
import bg from "@/messages/bg.json";
import en from "@/messages/en.json";

const dictionaries = {
  en,
  bg,
} as const;

type Dictionary = (typeof dictionaries)[AppLocale];
export type MessageKey = keyof Dictionary;

export function t(locale: AppLocale, key: MessageKey): string {
  const dictionary = dictionaries[locale] ?? dictionaries[defaultLocale];
  return dictionary[key] ?? dictionaries[defaultLocale][key];
}
