import { deepMerge } from './deepMerge.js'
import { enMessages } from './messages/en.js'
import { ruMessages } from './messages/ru.js'

/** @type {Record<string, typeof enMessages>} */
export const ADMIN_KIT_LOCALES = {
  en: enMessages,
  ru: ruMessages,
}

/**
 * @param {import('./types.js').AdminKitLocale} [locale]
 * @param {Partial<import('./types.js').AdminKitMessages>} [messages]
 * @returns {import('./types.js').AdminKitMessages}
 */
export const resolveAdminKitMessages = (locale = 'en', messages) => {
  const base = ADMIN_KIT_LOCALES[locale] || enMessages
  if (!messages) {
    return base
  }
  return deepMerge(base, messages)
}

/** @type {import('./types.js').AdminKitMessages} */
let currentMessages = enMessages

/** @type {import('./types.js').AdminKitLocale} */
let currentLocale = 'en'

/**
 * Configures admin-kit locale for React and non-React code.
 * Prefer wrapping the app with `AdminKitProvider`; call this directly when
 * you need locale before the first React render (e.g. store setup / tests).
 * @param {import('./types.js').ConfigureAdminKitOptions} [options]
 * @returns {import('./types.js').AdminKitMessages}
 */
export const configureAdminKit = ({ locale = 'en', messages } = {}) => {
  currentLocale = ADMIN_KIT_LOCALES[locale] ? locale : 'en'
  currentMessages = resolveAdminKitMessages(currentLocale, messages)
  return currentMessages
}

/**
 * Returns the active messages object (defaults to English when never configured).
 * @returns {import('./types.js').AdminKitMessages}
 */
export const getAdminKitMessages = () => currentMessages

/**
 * @returns {import('./types.js').AdminKitLocale}
 */
export const getAdminKitLocale = () => currentLocale
