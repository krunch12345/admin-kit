/**
 * Returns a same-origin in-app path safe for React Router Link / navigate.
 * Rejects protocol-relative URLs, backslash tricks, and absolute URLs
 * (see GHSA-wrjc-x8rr-h8h6 open-redirect class).
 *
 * @param {unknown} path
 * @param {string|null} [fallback='/'] - Returned when path is unsafe. Pass null to signal rejection.
 * @returns {string|null}
 */
export const sanitizeAppPath = (path, fallback = '/') => {
  if (typeof path !== 'string') {
    return fallback
  }

  const trimmed = path.trim()

  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback
  }

  if (trimmed.includes('\\')) {
    return fallback
  }

  try {
    const url = new URL(trimmed, 'https://admin-kit.invalid')

    if (url.origin !== 'https://admin-kit.invalid') {
      return fallback
    }

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

/**
 * @param {unknown} path
 * @returns {boolean}
 */
export const isSafeAppPath = (path) => sanitizeAppPath(path, null) !== null
