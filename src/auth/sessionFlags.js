export const SESSION_FLAG_KEY = 'hasSession'

/**
 * Clears both persistent and tab-scoped session markers.
 */
export const clearSessionFlags = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(SESSION_FLAG_KEY)
  sessionStorage.removeItem(SESSION_FLAG_KEY)
}

/**
 * Persists a session marker.
 * Remember-me → localStorage (survives browser restart).
 * Otherwise → sessionStorage only (cleared when the tab/browser session ends).
 * @param {boolean} rememberMe
 */
export const persistSessionFlag = (rememberMe) => {
  if (typeof window === 'undefined') {
    return
  }

  if (rememberMe) {
    localStorage.setItem(SESSION_FLAG_KEY, 'true')
    sessionStorage.removeItem(SESSION_FLAG_KEY)
    return
  }

  sessionStorage.setItem(SESSION_FLAG_KEY, 'true')
  localStorage.removeItem(SESSION_FLAG_KEY)
}

/**
 * @returns {boolean}
 */
export const hasPersistedSession = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(SESSION_FLAG_KEY) === 'true'
    || sessionStorage.getItem(SESSION_FLAG_KEY) === 'true'
}

/**
 * @returns {boolean} True when the session was stored with remember-me.
 */
export const isRememberMeSession = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(SESSION_FLAG_KEY) === 'true'
}
