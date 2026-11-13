import { describe, expect, it } from 'vitest'
import { resolveLoginRedirectPath } from './Login'

describe('resolveLoginRedirectPath', () => {
  it('uses explicit redirectPath when safe', () => {
    expect(resolveLoginRedirectPath('/account', { pathname: '/bands' }, '/')).toBe('/account')
  })

  it('uses location.state.from pathname and search when redirectPath is omitted', () => {
    expect(
      resolveLoginRedirectPath(undefined, { pathname: '/bands', search: '?q=1' }, '/'),
    ).toBe('/bands?q=1')
  })

  it('falls back to home when from is missing', () => {
    expect(resolveLoginRedirectPath(undefined, undefined, '/')).toBe('/')
  })

  it('falls back to home when from path is unsafe', () => {
    expect(
      resolveLoginRedirectPath(undefined, { pathname: '//evil.example', search: '' }, '/'),
    ).toBe('/')
  })

  it('falls back to home when explicit redirectPath is unsafe', () => {
    expect(resolveLoginRedirectPath('https://evil.example', { pathname: '/ok' }, '/')).toBe('/')
  })

  it('uses configured home fallback', () => {
    expect(resolveLoginRedirectPath(undefined, undefined, '/dashboard')).toBe('/dashboard')
  })
})
