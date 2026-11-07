import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isSafeAppPath, sanitizeAppPath } from './sanitizeAppPath.js'

describe('sanitizeAppPath', () => {
  it('returns relative app paths unchanged', () => {
    assert.equal(sanitizeAppPath('/account'), '/account')
    assert.equal(sanitizeAppPath('/posts?tab=1#top'), '/posts?tab=1#top')
  })

  it('rejects protocol-relative and backslash open redirects', () => {
    assert.equal(sanitizeAppPath('//evil.example'), '/')
    assert.equal(sanitizeAppPath('/\\evil.example'), '/')
    assert.equal(sanitizeAppPath('/foo\\bar'), '/')
    assert.equal(isSafeAppPath('//evil.example'), false)
  })

  it('rejects absolute URLs and non-paths', () => {
    assert.equal(sanitizeAppPath('https://evil.example/phish'), '/')
    assert.equal(sanitizeAppPath('javascript:alert(1)'), '/')
    assert.equal(sanitizeAppPath('account'), '/')
    assert.equal(sanitizeAppPath(null, '/login'), '/login')
  })

  it('returns null fallback when caller asks for rejection signal', () => {
    assert.equal(sanitizeAppPath('//evil.example', null), null)
    assert.equal(sanitizeAppPath('/ok', null), '/ok')
  })
})
