import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({ auth: {}, from: vi.fn() })),
  createServerClient: vi.fn(() => ({ auth: {}, from: vi.fn() })),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: {}, from: vi.fn() })),
}))

beforeEach(() => {
  process.env.SUPABASE_URL = 'https://test.supabase.co'
  process.env.SUPABASE_ANON_KEY = 'anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
  process.env.APP_URL = 'https://localhost:3000'
  process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_xxx'
  process.env.STRIPE_SECRET_KEY = 'sk_test_xxx'
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_xxx'
})

describe('createBrowserClient', () => {
  it('creates a client with public env vars', async () => {
    const { createBrowserClient } = await import('~/lib/supabase/client')
    const client = createBrowserClient()
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
  })
})

describe('createSupabaseServerClient', () => {
  it('creates a server client', async () => {
    const { createSupabaseServerClient } = await import('~/lib/supabase/server')
    const client = createSupabaseServerClient()
    expect(client).toBeDefined()
  })
})

describe('createSupabaseAdminClient', () => {
  it('creates an admin client', async () => {
    const { createSupabaseAdminClient } = await import('~/lib/supabase/admin')
    const client = createSupabaseAdminClient()
    expect(client).toBeDefined()
  })
})
