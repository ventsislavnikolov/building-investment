import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSignIn = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()
const mockGetUser = vi.fn()
const mockFrom = vi.fn()

vi.mock('~/lib/supabase/server', () => ({
  createSupabaseServerClient: () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
    from: mockFrom,
  }),
}))

// Test the core handler logic, not the createServerFn wrapper
import { handleLogin, handleRegister, handleLogout, handleGetSessionUser } from '~/lib/auth/handlers'

describe('handleLogin', () => {
  it('returns error when credentials invalid', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid credentials' }, data: null })
    const result = await handleLogin({ email: 'a@b.com', password: 'wrong' })
    expect(result.error).toBe('Invalid credentials')
  })

  it('returns success when credentials valid', async () => {
    mockSignIn.mockResolvedValue({ data: { user: { id: '123' } }, error: null })
    const result = await handleLogin({ email: 'a@b.com', password: 'correct' })
    expect(result.success).toBe(true)
  })
})

describe('handleGetSessionUser', () => {
  it('returns null when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const user = await handleGetSessionUser()
    expect(user).toBeNull()
  })

  it('returns user when authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: '123', email: 'a@b.com' } }, error: null })
    const user = await handleGetSessionUser()
    expect(user).toEqual({ id: '123', email: 'a@b.com' })
  })
})

describe('handleLogout', () => {
  it('calls signOut and returns success', async () => {
    mockSignOut.mockResolvedValue({ error: null })
    const result = await handleLogout()
    expect(result.success).toBe(true)
    expect(mockSignOut).toHaveBeenCalled()
  })
})
