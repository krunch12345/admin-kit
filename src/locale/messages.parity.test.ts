import assert from 'node:assert/strict'
import { enMessages } from './messages/en'
import { ruMessages } from './messages/ru'

const collectKeys = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : []
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
    const next = prefix ? `${prefix}.${key}` : key
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return collectKeys(nested, next)
    }
    return [next]
  })
}

describe('locale message dictionaries', () => {
  it('keeps en and ru key trees in parity', () => {
    const enKeys = collectKeys(enMessages).sort()
    const ruKeys = collectKeys(ruMessages).sort()
    assert.deepEqual(ruKeys, enKeys)
  })
})
