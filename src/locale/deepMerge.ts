type PlainObject = Record<string, unknown>

const isPlainObject = (value: unknown): value is PlainObject => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
)

/**
 * Deep-merges plain objects. Arrays and non-plain values are replaced, not concatenated.
 */
export const deepMerge = <T extends object>(target: T, source: unknown): T => {
  if (!isPlainObject(source)) {
    return source as T
  }

  const output: PlainObject = { ...(target as PlainObject) }

  for (const key of Object.keys(source)) {
    const next = source[key]
    const prev = output[key]

    output[key] = isPlainObject(next) && isPlainObject(prev)
      ? deepMerge(prev, next)
      : next
  }

  return output as T
}
