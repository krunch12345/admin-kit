import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  configureAdminKit,
  getAdminKitLocale,
  getAdminKitMessages,
  resolveAdminKitMessages,
} from './runtime.js'
import { formatMessage } from './formatMessage.js'
import { deepMerge } from './deepMerge.js'
import { enMessages } from './messages/en.js'
import { ruMessages } from './messages/ru.js'

describe('deepMerge', () => {
  it('merges nested objects without mutating the base', () => {
    const base = { a: { b: 1, c: 2 }, d: 3 }
    const next = deepMerge(base, { a: { c: 9 } })
    assert.deepEqual(next, { a: { b: 1, c: 9 }, d: 3 })
    assert.equal(base.a.c, 2)
  })
})

describe('formatMessage', () => {
  it('replaces named placeholders', () => {
    assert.equal(
      formatMessage('Hello ${name}!', { name: 'Ada' }),
      'Hello Ada!',
    )
  })

  it('replaces missing placeholders with empty string', () => {
    assert.equal(formatMessage('x=${missing}', {}), 'x=')
  })
})

describe('resolveAdminKitMessages', () => {
  it('returns english messages by default', () => {
    assert.equal(resolveAdminKitMessages().login.pageTitle, enMessages.login.pageTitle)
  })

  it('returns russian messages for locale ru', () => {
    assert.equal(resolveAdminKitMessages('ru').login.pageTitle, ruMessages.login.pageTitle)
  })

  it('deep-merges custom messages over the selected locale', () => {
    const messages = resolveAdminKitMessages('ru', {
      login: { pageTitle: 'Custom' },
    })
    assert.equal(messages.login.pageTitle, 'Custom')
    assert.equal(messages.login.submit, ruMessages.login.submit)
  })
})

describe('configureAdminKit', () => {
  beforeEach(() => {
    configureAdminKit({ locale: 'en' })
  })

  it('updates runtime messages and locale', () => {
    configureAdminKit({ locale: 'ru' })
    assert.equal(getAdminKitLocale(), 'ru')
    assert.equal(getAdminKitMessages().common.yes, 'Да')
  })

  it('falls back to english for unknown locale codes', () => {
    configureAdminKit({ locale: /** @type {any} */ ('de') })
    assert.equal(getAdminKitLocale(), 'en')
    assert.equal(getAdminKitMessages().common.yes, 'Yes')
  })
})
