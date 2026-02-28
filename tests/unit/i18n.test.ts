import { describe, it, expect } from 'vitest'
import { t, isSupportedLocale } from '~/lib/i18n'

describe('t()', () => {
  it('returns English string for en locale', () => {
    expect(t('en', 'common.loading')).toBe('Loading...')
  })

  it('returns Bulgarian string for bg locale', () => {
    expect(t('bg', 'common.loading')).toBe('Зареждане...')
  })

  it('falls back to key when string missing', () => {
    expect(t('en', 'nonexistent.key')).toBe('nonexistent.key')
  })
})

describe('isSupportedLocale()', () => {
  it('returns true for en', () => {
    expect(isSupportedLocale('en')).toBe(true)
  })

  it('returns true for bg', () => {
    expect(isSupportedLocale('bg')).toBe(true)
  })

  it('returns false for unsupported locale', () => {
    expect(isSupportedLocale('fr')).toBe(false)
  })
})
