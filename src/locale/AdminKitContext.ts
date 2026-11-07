import { createContext } from 'react'
import { enMessages } from './messages/en'
import type { AdminKitLocale, AdminKitMessages } from './types'

export interface AdminKitContextValue {
  locale: AdminKitLocale
  messages: AdminKitMessages
}

export const AdminKitContext = createContext<AdminKitContextValue>({
  locale: 'en',
  messages: enMessages,
})
