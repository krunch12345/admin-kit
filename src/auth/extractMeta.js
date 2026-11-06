/**
 * Safely extracts a special `__meta` field from the RTK Query `args` object,
 * returning both the meta information and the remaining arguments to pass to `fetchBaseQuery`.
 *
 * @param {object|string} args
 *   - If an object, may contain a `__meta` field (custom metadata for this request).
 *   - If a string, treated as a simple URL and `meta` will be empty.
 *
 * @returns {{ meta: object, cleanArgs: object|string }}
 *   - `meta`: the extracted metadata object (empty if none provided).
 *   - `cleanArgs`: the original args with `__meta` removed (or the string URL if args was a string).
 *
 * @example
 * // Object args with __meta
 * const { meta, cleanArgs } = extractMeta({
 *   url: '/drafts',
 *   method: 'GET',
 *   __meta: { requiresAuth: true }
 * })
 * // meta === { requiresAuth: true }
 * // cleanArgs === { url: '/drafts', method: 'GET' }
 *
 * @example
 * // String args
 * const { meta, cleanArgs } = extractMeta('/drafts')
 * // meta === {}
 * // cleanArgs === '/drafts'
 */
export const extractMeta = (args) => {
  if (typeof args === 'string') {
    return { meta: {}, cleanArgs: args }
  }

  const { __meta, ...cleanArgs } = args
  return { meta: __meta ?? {}, cleanArgs }
}
