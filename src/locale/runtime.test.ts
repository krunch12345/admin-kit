import {
  configureAdminKit,
  getAdminKitLocale,
  getAdminKitMessages,
  resolveAdminKitMessages,
} from './runtime'
import { formatMessage } from './formatMessage'
import { deepMerge } from './deepMerge'
import { enMessages } from './messages/en'
import { ruMessages } from './messages/ru'
import type { AdminKitLocale } from './types'

describe('deepMerge', () => {
  it('merges nested objects without mutating the base', () => {
    const base = { a: { b: 1, c: 2 }, d: 3 }
    const next = deepMerge(base, { a: { c: 9 } })
    expect(next).toEqual({ a: { b: 1, c: 9 }, d: 3 })
    expect(base.a.c).toBe(2)
  })
})

describe('formatMessage', () => {
  it('replaces named placeholders', () => {
    expect(formatMessage('Hello ${name}!', { name: 'Ada' })).toBe('Hello Ada!')
  })

  it('replaces missing placeholders with empty string', () => {
    expect(formatMessage('x=${missing}', {})).toBe('x=')
  })
})

describe('resolveAdminKitMessages', () => {
  it('returns english messages by default', () => {
    expect(resolveAdminKitMessages().login.pageTitle).toBe(enMessages.login.pageTitle)
  })

  it('returns russian messages for locale ru', () => {
    expect(resolveAdminKitMessages('ru').login.pageTitle).toBe(ruMessages.login.pageTitle)
  })

  it('deep-merges custom messages over the selected locale', () => {
    const messages = resolveAdminKitMessages('ru', {
      login: { pageTitle: 'Custom' },
    })
    expect(messages.login.pageTitle).toBe('Custom')
    expect(messages.login.submit).toBe(ruMessages.login.submit)
  })
})

describe('configureAdminKit', () => {
  beforeEach(() => {
    configureAdminKit({ locale: 'en' })
  })

  it('updates runtime messages and locale', () => {
    configureAdminKit({ locale: 'ru' })
    expect(getAdminKitLocale()).toBe('ru')
    expect(getAdminKitMessages().common.yes).toBe('Да')
  })

  it('falls back to english for unknown locale codes', () => {
    configureAdminKit({ locale: 'de' as unknown as AdminKitLocale })
    expect(getAdminKitLocale()).toBe('en')
    expect(getAdminKitMessages().common.yes).toBe('Yes')
  })
})
