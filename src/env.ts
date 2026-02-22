import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(source: Record<string, string | undefined>): AppEnv {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    throw new Error("Missing or invalid environment variables");
  }

  return parsed.data;
}

let cachedEnv: AppEnv | null = null;

export function getRuntimeEnv(): AppEnv {
  if (!cachedEnv) {
    cachedEnv = getEnv(process.env);
  }

  return cachedEnv;
}
