/**
 * Parses a Retry-After value (seconds number/string or HTTP-date) into whole seconds.
 */
export const parseRetryAfterSeconds = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.ceil(value)
  }

  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const asNumber = Number(trimmed)
  if (Number.isFinite(asNumber) && asNumber >= 0) {
    return Math.ceil(asNumber)
  }

  const asDate = Date.parse(trimmed)
  if (Number.isNaN(asDate)) {
    return undefined
  }

  return Math.max(0, Math.ceil((asDate - Date.now()) / 1000))
}

export interface RateLimitErrorData {
  message?: string
  retryAfter?: number
  [key: string]: unknown
}

/**
 * Builds a 429 error data payload with message + retryAfter from body and/or header.
 */
export const buildRateLimitErrorData = (
  data: unknown,
  retryAfterHeader?: string | null,
): RateLimitErrorData => {
  const record = data !== null && typeof data === 'object'
    ? { ...(data as Record<string, unknown>) }
    : {}

  const retryAfter = parseRetryAfterSeconds(record.retryAfter)
    ?? parseRetryAfterSeconds(retryAfterHeader)

  if (retryAfter !== undefined) {
    record.retryAfter = retryAfter
  }

  if (typeof record.message !== 'string' || !record.message) {
    delete record.message
  }

  return record
}
