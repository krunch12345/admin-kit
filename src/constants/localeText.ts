import { enMessages } from '../locale/messages/en'
import { getAdminKitMessages } from '../locale/runtime'
import { toMuiLocaleText } from '../locale/toMuiLocaleText'
import type { MuiPickersLocaleText } from '../locale/toMuiLocaleText'

/**
 * English MUI X date/time picker localeText (static default / backward compatible).
 * Prefer `useAdminKitLocaleText()` or `getLocaleText()` when using AdminKitProvider.
 */
export const LOCALE_TEXT: MuiPickersLocaleText = toMuiLocaleText(enMessages.datePickers)

/**
 * Active MUI X date/time picker localeText from the configured admin-kit locale.
 */
export const getLocaleText = (): MuiPickersLocaleText => toMuiLocaleText(getAdminKitMessages().datePickers)
