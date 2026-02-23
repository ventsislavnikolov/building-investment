import AdminMetricsPage from "@/app/[locale]/admin/metrics/page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const redirectMock = jest.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});

jest.mock("next/navigation", () => ({
  redirect: (path: string) => redirectMock(path),
}));

jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: jest.fn(),
}));

describe("admin metrics page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects missing users to login with metrics next path", async () => {
    const getUser = jest.fn().mockResolvedValue({ data: { user: null } });

    (createSupabaseServerClient as jest.Mock).mockResolvedValue({
      auth: { getUser },
    });

    await expect(
      AdminMetricsPage({ params: Promise.resolve({ locale: "en" }) }),
    ).rejects.toThrow("REDIRECT:/en/login?next=%2Fen%2Fadmin%2Fmetrics");
  });
});
