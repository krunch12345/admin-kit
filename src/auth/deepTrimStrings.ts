const SKIP_TRIM_KEYS = new Set(['password', 'token', 'currentPassword', 'newPassword', 'confirmPassword'])

export interface DeepTrimOptions {
  skipKeys?: Set<string>
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') {
    return false
  }

  if (Array.isArray(value) || value instanceof FormData) {
    return false
  }

  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

const trimValue = (value: unknown, options: DeepTrimOptions): unknown => {
  const skipKeys = options.skipKeys || SKIP_TRIM_KEYS

  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value)) {
    return value.map((item) => trimValue(item, options))
  }

  if (!isPlainObject(value)) {
    return value
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      if (skipKeys.has(key) && typeof entry === 'string') {
        return [key, entry]
      }

      return [key, trimValue(entry, options)]
    }),
  )
}

/**
 * Recursively trims leading and trailing whitespace from string values
 * within plain objects and arrays. Skips passwords/tokens and non-plain
 * objects (Date, File, Blob, etc.).
 */
export const deepTrimStrings = <T>(value: T, options: DeepTrimOptions = {}): T => (
  trimValue(value, options) as T
)
