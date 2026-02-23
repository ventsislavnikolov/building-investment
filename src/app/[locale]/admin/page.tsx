import { redirect } from "next/navigation";
import { evaluateAdminAccess } from "@/lib/auth/admin-access";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminIndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminIndexPage({ params }: AdminIndexPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  const profileLookup = data.user
    ? await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle()
    : null;

  const access = evaluateAdminAccess(
    locale,
    data.user
      ? {
          id: data.user.id,
          role: profileLookup?.data?.role ?? "investor",
        }
      : null,
    `/${locale}/admin`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  redirect(`/${locale}/admin/dashboard`);
}
