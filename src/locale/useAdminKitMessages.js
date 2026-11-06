import { useContext } from 'react'
import { AdminKitContext } from './AdminKitContext.js'
import { getAdminKitMessages, getAdminKitLocale } from './runtime.js'
import { toMuiLocaleText } from './toMuiLocaleText.js'

/**
 * Active admin-kit messages (from provider, or silent English fallback).
 * @returns {import('./types.js').AdminKitMessages}
 */
export const useAdminKitMessages = () => {
  const ctx = useContext(AdminKitContext)
  return ctx?.messages || getAdminKitMessages()
}

/**
 * Active locale code.
 * @returns {import('./types.js').AdminKitLocale}
 */
export const useAdminKitLocale = () => {
  const ctx = useContext(AdminKitContext)
  return ctx?.locale || getAdminKitLocale()
}

/**
 * MUI X date/time picker `localeText` for the active locale.
 * @returns {object}
 */
export const useAdminKitLocaleText = () => {
  const messages = useAdminKitMessages()
  return toMuiLocaleText(messages.datePickers)
}
