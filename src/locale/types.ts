import type { enMessages } from './messages/en'

export type AdminKitMessages = typeof enMessages

export type AdminKitLocale = 'en' | 'ru'

export type DeepPartial<T> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key]
}

export interface ConfigureAdminKitOptions {
  locale?: AdminKitLocale
  messages?: DeepPartial<AdminKitMessages>
}
