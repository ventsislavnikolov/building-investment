import { LoginForm } from "@/components/auth/login-form";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale: rawLocale } = await params;
  const { error, next } = await searchParams;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-8 py-20">
      <h1 className="font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "login.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">{t(locale, "login.subtitle")}</p>

      <LoginForm
        locale={locale}
        next={next ?? `/${locale}/dashboard`}
        initialError={error}
      />
    </main>
  );
}
