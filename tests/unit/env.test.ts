import { describe, it, expect } from 'vitest'
import { getEnv } from '~/env'

describe('getEnv', () => {
  it('throws when required vars are missing', () => {
    expect(() => getEnv({})).toThrow('Missing or invalid environment variables')
  })

  it('returns parsed env when all vars present', () => {
    const env = getEnv({
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_ANON_KEY: 'anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'service-key',
      APP_URL: 'https://localhost:3000',
      STRIPE_PUBLISHABLE_KEY: 'pk_test_xxx',
      STRIPE_SECRET_KEY: 'sk_test_xxx',
      STRIPE_WEBHOOK_SECRET: 'whsec_xxx',
    })
    expect(env.SUPABASE_URL).toBe('https://test.supabase.co')
  })
})
