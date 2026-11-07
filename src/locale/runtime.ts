import { deepMerge } from './deepMerge'
import { enMessages } from './messages/en'
import { ruMessages } from './messages/ru'
import type {
  AdminKitLocale,
  AdminKitMessages,
  ConfigureAdminKitOptions,
  DeepPartial,
} from './types'

export const ADMIN_KIT_LOCALES: Record<AdminKitLocale, AdminKitMessages> = {
  en: enMessages,
  ru: ruMessages,
}

const isKnownLocale = (locale: string): locale is AdminKitLocale => (
  Object.prototype.hasOwnProperty.call(ADMIN_KIT_LOCALES, locale)
)

export const resolveAdminKitMessages = (
  locale: AdminKitLocale = 'en',
  messages?: DeepPartial<AdminKitMessages>,
): AdminKitMessages => {
  const base = isKnownLocale(locale) ? ADMIN_KIT_LOCALES[locale] : enMessages
  if (!messages) {
    return base
  }
  return deepMerge(base, messages)
}

let currentMessages: AdminKitMessages = enMessages
let currentLocale: AdminKitLocale = 'en'

/**
 * Configures admin-kit locale for React and non-React code.
 * Prefer wrapping the app with `AdminKitProvider`; call this directly when
 * you need locale before the first React render (e.g. store setup / tests).
 */
export const configureAdminKit = ({ locale = 'en', messages }: ConfigureAdminKitOptions = {}): AdminKitMessages => {
  currentLocale = isKnownLocale(locale) ? locale : 'en'
  currentMessages = resolveAdminKitMessages(currentLocale, messages)
  return currentMessages
}

/**
 * Returns the active messages object (defaults to English when never configured).
 */
export const getAdminKitMessages = (): AdminKitMessages => currentMessages

export const getAdminKitLocale = (): AdminKitLocale => currentLocale
