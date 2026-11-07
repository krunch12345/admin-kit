import { DEFAULT_STORAGE_KEYS } from '../config/defaults'
import type { AdminKitStorageKeys } from '../config/defaults'

/** @deprecated Use config.storageKeys.sessionFlag via AdminKitProvider. Kept for migration. */
export const SESSION_FLAG_KEY = DEFAULT_STORAGE_KEYS.sessionFlag

let activeSessionFlagKey = DEFAULT_STORAGE_KEYS.sessionFlag
let activeLegacyUserKey = DEFAULT_STORAGE_KEYS.legacyUser

/**
 * Updates storage key names used by session helpers (called from AdminKitProvider).
 */
export const configureSessionStorageKeys = (keys: Partial<AdminKitStorageKeys> = {}): void => {
  if (keys.sessionFlag) {
    activeSessionFlagKey = keys.sessionFlag
  }
  if (keys.legacyUser) {
    activeLegacyUserKey = keys.legacyUser
  }
}

export const getSessionFlagKey = (): string => activeSessionFlagKey

export const getLegacyUserKey = (): string => activeLegacyUserKey

/**
 * Clears both persistent and tab-scoped session markers.
 */
export const clearSessionFlags = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(activeSessionFlagKey)
  sessionStorage.removeItem(activeSessionFlagKey)
}

/**
 * Removes legacy `user` keys left by older kit versions.
 */
export const clearLegacyUserKeys = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(activeLegacyUserKey)
  sessionStorage.removeItem(activeLegacyUserKey)
  localStorage.removeItem('user')
  sessionStorage.removeItem('user')
  localStorage.removeItem('hasSession')
  sessionStorage.removeItem('hasSession')
}

/**
 * Persists a session marker.
 * Remember-me → localStorage (survives browser restart).
 * Otherwise → sessionStorage only (cleared when the tab/browser session ends).
 */
export const persistSessionFlag = (rememberMe: boolean): void => {
  if (typeof window === 'undefined') {
    return
  }

  if (rememberMe) {
    localStorage.setItem(activeSessionFlagKey, 'true')
    sessionStorage.removeItem(activeSessionFlagKey)
    return
  }

  sessionStorage.setItem(activeSessionFlagKey, 'true')
  localStorage.removeItem(activeSessionFlagKey)
}

export const hasPersistedSession = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(activeSessionFlagKey) === 'true'
    || sessionStorage.getItem(activeSessionFlagKey) === 'true'
}

/**
 * @returns True when the session was stored with remember-me.
 */
export const isRememberMeSession = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(activeSessionFlagKey) === 'true'
}
