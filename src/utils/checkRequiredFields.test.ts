import { describe, expect, it, vi } from 'vitest'
import { checkRequiredFields, getMissingRequiredFields } from './checkRequiredFields'

describe('getMissingRequiredFields', () => {
  it('returns empty list when all fields are filled', () => {
    expect(getMissingRequiredFields({ a: 'x', b: [1] }, ['a', 'b'])).toEqual([])
  })

  it('returns absent and empty fields', () => {
    const data = { a: ' ', b: [], c: {}, d: 0 }

    expect(getMissingRequiredFields(data, ['a', 'b', 'c', 'd', 'e'])).toEqual(['a', 'b', 'c', 'e'])
  })

  it('returns all fields when data is not an object', () => {
    expect(getMissingRequiredFields(null, ['a', 'b'])).toEqual(['a', 'b'])
  })
})

describe('checkRequiredFields', () => {
  it('returns true when all required fields are filled', () => {
    expect(checkRequiredFields({ a: 'x' }, ['a'])).toBe(true)
  })

  it('returns false when a required field is empty', () => {
    expect(checkRequiredFields({ a: '' }, ['a'])).toBe(false)
  })

  it('does not log when logger is not provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    checkRequiredFields({}, ['a'])

    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('logs missing field when logger is provided', () => {
    const logger = { error: vi.fn(), warn: vi.fn() }

    checkRequiredFields({}, ['a'], { logger })

    expect(logger.warn).toHaveBeenCalledTimes(1)
  })
})
