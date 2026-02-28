import { describe, it, expect } from 'vitest'
import { requireAuth, requireAdmin } from '~/lib/auth/guards'

describe('requireAuth', () => {
  it('throws redirect when user is null', () => {
    expect(() => requireAuth(null, 'en')).toThrow()
  })

  it('returns user when authenticated', () => {
    const user = { id: '123', email: 'a@b.com' }
    expect(requireAuth(user, 'en')).toEqual(user)
  })

  it('throws redirect with /bg/login for bg locale', () => {
    expect(() => requireAuth(null, 'bg')).toThrow()
  })
})

describe('requireAdmin', () => {
  it('throws redirect when profile is null', () => {
    expect(() => requireAdmin(null, 'en')).toThrow()
  })

  it('throws redirect when role is investor', () => {
    expect(() => requireAdmin({ id: '1', role: 'investor' }, 'en')).toThrow()
  })

  it('returns profile when role is admin', () => {
    const profile = { id: '1', role: 'admin' }
    expect(requireAdmin(profile, 'en')).toEqual(profile)
  })

  it('returns profile when role is project_owner', () => {
    const profile = { id: '1', role: 'project_owner' }
    expect(requireAdmin(profile, 'en')).toEqual(profile)
  })
})
