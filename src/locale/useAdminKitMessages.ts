import { useContext } from 'react'
import { AdminKitContext } from './AdminKitContext'
import { getAdminKitMessages, getAdminKitLocale } from './runtime'
import { toMuiLocaleText } from './toMuiLocaleText'
import type { MuiPickersLocaleText } from './toMuiLocaleText'
import type { AdminKitLocale, AdminKitMessages } from './types'

/**
 * Active admin-kit messages (from provider, or silent English fallback).
 */
export const useAdminKitMessages = (): AdminKitMessages => {
  const ctx = useContext(AdminKitContext)
  return ctx?.messages || getAdminKitMessages()
}

/**
 * Active locale code.
 */
export const useAdminKitLocale = (): AdminKitLocale => {
  const ctx = useContext(AdminKitContext)
  return ctx?.locale || getAdminKitLocale()
}

/**
 * MUI X date/time picker `localeText` for the active locale.
 */
export const useAdminKitLocaleText = (): MuiPickersLocaleText => {
  const messages = useAdminKitMessages()
  return toMuiLocaleText(messages.datePickers)
}
