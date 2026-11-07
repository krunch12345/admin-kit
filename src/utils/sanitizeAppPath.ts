/**
 * Returns a same-origin in-app path safe for React Router Link / navigate.
 * Rejects protocol-relative URLs, backslash tricks, and absolute URLs
 * (see GHSA-wrjc-x8rr-h8h6 open-redirect class).
 *
 * @param path - Candidate path.
 * @param fallback - Returned when path is unsafe. Pass null to signal rejection.
 */
export const sanitizeAppPath = <Fallback extends string | null = '/'>(
  path: unknown,
  fallback: Fallback = '/' as Fallback,
): string | Fallback => {
  if (typeof path !== 'string') {
    return fallback
  }

  const trimmed = path.trim()

  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback
  }

  if (trimmed.includes('\\') || /%5c/i.test(trimmed)) {
    return fallback
  }

  try {
    const url = new URL(trimmed, 'https://admin-kit.invalid')

    if (url.origin !== 'https://admin-kit.invalid') {
      return fallback
    }

    const result = `${url.pathname}${url.search}${url.hash}`

    // URL() collapses `/..//evil.com` into a protocol-relative `//evil.com`.
    if (result.startsWith('//') || !result.startsWith('/')) {
      return fallback
    }

    return result
  } catch {
    return fallback
  }
}

export const isSafeAppPath = (path: unknown): boolean => sanitizeAppPath(path, null) !== null
