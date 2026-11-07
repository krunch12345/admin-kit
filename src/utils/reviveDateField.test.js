import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { reviveDateField } from './reviveDateField.js'

describe('reviveDateField', () => {
  it('returns Date from ISO string', () => {
    const date = reviveDateField('2024-01-15T12:00:00.000Z')
    assert.equal(date instanceof Date, true)
    assert.equal(date.toISOString(), '2024-01-15T12:00:00.000Z')
  })

  it('returns null for invalid string', () => {
    assert.equal(reviveDateField('not-a-date'), null)
  })

  it('returns Date instance unchanged', () => {
    const input = new Date('2024-06-01T00:00:00.000Z')
    assert.equal(reviveDateField(input), input)
  })

  it('returns null for unsupported values', () => {
    assert.equal(reviveDateField(null), null)
    assert.equal(reviveDateField(123), null)
  })
})
