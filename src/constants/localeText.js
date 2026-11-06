import { enMessages } from '../locale/messages/en.js'
import { getAdminKitMessages } from '../locale/runtime.js'
import { toMuiLocaleText } from '../locale/toMuiLocaleText.js'

/**
 * English MUI X date/time picker localeText (static default / backward compatible).
 * Prefer `useAdminKitLocaleText()` or `getLocaleText()` when using AdminKitProvider.
 */
export const LOCALE_TEXT = toMuiLocaleText(enMessages.datePickers)

/**
 * Active MUI X date/time picker localeText from the configured admin-kit locale.
 * @returns {object}
 */
export const getLocaleText = () => toMuiLocaleText(getAdminKitMessages().datePickers)
