import { isSafeAppPath, sanitizeAppPath } from './sanitizeAppPath'

describe('sanitizeAppPath', () => {
  it('returns relative app paths unchanged', () => {
    expect(sanitizeAppPath('/account')).toBe('/account')
    expect(sanitizeAppPath('/posts?tab=1#top')).toBe('/posts?tab=1#top')
  })

  it('rejects protocol-relative and backslash open redirects', () => {
    expect(sanitizeAppPath('//evil.example')).toBe('/')
    expect(sanitizeAppPath('/\\evil.example')).toBe('/')
    expect(sanitizeAppPath('/foo\\bar')).toBe('/')
    expect(isSafeAppPath('//evil.example')).toBe(false)
  })

  it('rejects absolute URLs and non-paths', () => {
    expect(sanitizeAppPath('https://evil.example/phish')).toBe('/')
    expect(sanitizeAppPath('javascript:alert(1)')).toBe('/')
    expect(sanitizeAppPath('account')).toBe('/')
    expect(sanitizeAppPath(null, '/login')).toBe('/login')
  })

  it('returns null fallback when caller asks for rejection signal', () => {
    expect(sanitizeAppPath('//evil.example', null)).toBeNull()
    expect(sanitizeAppPath('/ok', null)).toBe('/ok')
  })

  it('rejects dot-segment collapses into protocol-relative paths', () => {
    expect(sanitizeAppPath('/..//evil.com')).toBe('/')
    expect(sanitizeAppPath('/.//evil.com')).toBe('/')
    expect(sanitizeAppPath('/a/..//evil.com')).toBe('/')
    expect(isSafeAppPath('/..//evil.com')).toBe(false)
  })

  it('rejects encoded backslash tricks', () => {
    expect(sanitizeAppPath('/%5cevil.example')).toBe('/')
    expect(sanitizeAppPath('/%5Cevil.example')).toBe('/')
    expect(isSafeAppPath('/%5cevil.example')).toBe(false)
  })
})
