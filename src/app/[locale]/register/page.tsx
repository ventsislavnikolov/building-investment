import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ next?: string }>;
};

export default async function RegisterPage({
  params,
  searchParams,
}: RegisterPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;
  const { next } = (await searchParams) ?? {};

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-8 py-20">
      <h1 className="font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "register.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "register.subtitle")}
      </p>
      <RegisterForm locale={locale} next={next ?? `/${locale}/dashboard`} />
      <p className="mt-8 text-sm text-muted">
        {t(locale, "register.haveAccount")}{" "}
        <Link
          href={`/${locale}/login`}
          className="font-semibold text-accent transition hover:opacity-80"
        >
          {t(locale, "register.loginLink")}
        </Link>
      </p>
    </main>
  );
}
