import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardTransactions } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TransactionsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TransactionsPage({
  params,
}: TransactionsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/transactions`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const transactions = await fetchDashboardTransactions(
    supabase,
    access.user.id,
    locale,
  );

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.transactions.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.transactions.subtitle")}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.transactions.totalDebits")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{transactions.totalDebits.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.transactions.totalCredits")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{transactions.totalCredits.toFixed(2)}
          </p>
        </article>
      </div>

      {transactions.items.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {t(locale, "dashboard.transactions.empty")}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {transactions.items.map((transaction) => (
            <li
              key={transaction.id}
              className="grid gap-4 rounded-xl border border-foreground/10 bg-white/70 p-4 sm:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {transaction.label}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {transaction.createdAt
                    ? new Date(transaction.createdAt).toLocaleDateString(locale)
                    : "-"}
                </p>
              </div>
              <p className="text-sm text-muted">{transaction.source}</p>
              <p className="text-right font-semibold text-foreground">
                {transaction.kind === "credit" ? "+" : "-"}€
                {transaction.amount.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
