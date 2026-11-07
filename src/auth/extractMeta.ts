import type { AdminKitExtraOptions } from './createAdminBaseQuery'

export type MetaRequestArgs = Record<string, unknown> & { __meta?: AdminKitExtraOptions }

export interface ExtractedMeta {
  meta: AdminKitExtraOptions
  cleanArgs: string | Record<string, unknown>
}

/**
 * Safely extracts a special `__meta` field from the RTK Query `args` object,
 * returning both the meta information and the remaining arguments to pass to `fetchBaseQuery`.
 *
 * - If `args` is an object, it may contain a `__meta` field (custom metadata for this request).
 * - If `args` is a string, it is treated as a simple URL and `meta` will be empty.
 *
 * @example
 * const { meta, cleanArgs } = extractMeta({
 *   url: '/drafts',
 *   method: 'GET',
 *   __meta: { requiresAuth: true }
 * })
 * // meta === { requiresAuth: true }
 * // cleanArgs === { url: '/drafts', method: 'GET' }
 */
export const extractMeta = (args: string | MetaRequestArgs): ExtractedMeta => {
  if (typeof args === 'string') {
    return { meta: {}, cleanArgs: args }
  }

  const { __meta, ...cleanArgs } = args
  return { meta: __meta ?? {}, cleanArgs }
}
