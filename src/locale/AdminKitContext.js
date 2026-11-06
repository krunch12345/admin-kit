import { createContext } from 'react'
import { enMessages } from './messages/en.js'

/**
 * @typedef {object} AdminKitContextValue
 * @property {import('./types.js').AdminKitLocale} locale
 * @property {import('./types.js').AdminKitMessages} messages
 */

/** @type {import('react').Context<AdminKitContextValue>} */
export const AdminKitContext = createContext({
  locale: 'en',
  messages: enMessages,
})
