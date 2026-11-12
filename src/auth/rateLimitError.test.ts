import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildRateLimitErrorData, parseRetryAfterSeconds } from './rateLimitError'

describe('parseRetryAfterSeconds', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns ceil seconds from a finite number', () => {
    expect(parseRetryAfterSeconds(12.2)).toBe(13)
    expect(parseRetryAfterSeconds(0)).toBe(0)
  })

  it('parses numeric Retry-After header strings', () => {
    expect(parseRetryAfterSeconds('45')).toBe(45)
  })

  it('parses HTTP-date Retry-After values', () => {
    expect(parseRetryAfterSeconds('Thu, 01 Jan 2026 00:00:30 GMT')).toBe(30)
  })

  it('returns undefined for invalid values', () => {
    expect(parseRetryAfterSeconds(undefined)).toBeUndefined()
    expect(parseRetryAfterSeconds(null)).toBeUndefined()
    expect(parseRetryAfterSeconds('')).toBeUndefined()
    expect(parseRetryAfterSeconds('not-a-date')).toBeUndefined()
    expect(parseRetryAfterSeconds(Number.NaN)).toBeUndefined()
  })
})

describe('buildRateLimitErrorData', () => {
  it('prefers body retryAfter over the header', () => {
    expect(buildRateLimitErrorData({ message: 'slow down', retryAfter: 10 }, '99')).toEqual({
      message: 'slow down',
      retryAfter: 10,
    })
  })

  it('falls back to Retry-After header when body omits retryAfter', () => {
    expect(buildRateLimitErrorData({ message: 'slow down' }, '15')).toEqual({
      message: 'slow down',
      retryAfter: 15,
    })
  })

  it('keeps non-message fields and drops empty message', () => {
    expect(buildRateLimitErrorData({ message: '', code: 'RATE' }, '3')).toEqual({
      code: 'RATE',
      retryAfter: 3,
    })
  })
})
