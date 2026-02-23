import AdminIndexPage from "@/app/[locale]/admin/page";
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

describe("admin index page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects missing users to login with admin index next path", async () => {
    const getUser = jest.fn().mockResolvedValue({ data: { user: null } });

    (createSupabaseServerClient as jest.Mock).mockResolvedValue({
      auth: { getUser },
    });

    await expect(
      AdminIndexPage({ params: Promise.resolve({ locale: "en" }) }),
    ).rejects.toThrow("REDIRECT:/en/login?next=%2Fen%2Fadmin");
  });

  it("redirects allowed admin roles to admin dashboard", async () => {
    const getUser = jest.fn().mockResolvedValue({
      data: { user: { id: "admin-1" } },
    });
    const maybeSingle = jest.fn().mockResolvedValue({
      data: { role: "admin" },
    });
    const eq = jest.fn().mockReturnValue({ maybeSingle });
    const select = jest.fn().mockReturnValue({ eq });
    const from = jest.fn().mockReturnValue({ select });

    (createSupabaseServerClient as jest.Mock).mockResolvedValue({
      auth: { getUser },
      from,
    });

    await expect(
      AdminIndexPage({ params: Promise.resolve({ locale: "en" }) }),
    ).rejects.toThrow("REDIRECT:/en/admin/dashboard");
  });
});
