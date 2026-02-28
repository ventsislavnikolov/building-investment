import { describe, it, expect } from 'vitest'
import { getLocaleFromParams, localePath } from '~/lib/routing'

describe('getLocaleFromParams', () => {
  it('returns en when no locale param', () => {
    expect(getLocaleFromParams(undefined)).toBe('en')
  })

  it('returns bg when locale param is bg', () => {
    expect(getLocaleFromParams('bg')).toBe('bg')
  })

  it('returns en for unknown locale param', () => {
    expect(getLocaleFromParams('fr')).toBe('en')
  })
})

describe('localePath', () => {
  it('returns path as-is for en locale', () => {
    expect(localePath('en', '/projects')).toBe('/projects')
  })

  it('prefixes path with /bg for bg locale', () => {
    expect(localePath('bg', '/projects')).toBe('/bg/projects')
  })
})
