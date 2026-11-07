import { reviveDateField } from './reviveDateField'

describe('reviveDateField', () => {
  it('returns Date from ISO string', () => {
    const date = reviveDateField('2024-01-15T12:00:00.000Z')
    expect(date).toBeInstanceOf(Date)
    expect(date?.toISOString()).toBe('2024-01-15T12:00:00.000Z')
  })

  it('returns null for invalid string', () => {
    expect(reviveDateField('not-a-date')).toBeNull()
  })

  it('returns Date instance unchanged', () => {
    const input = new Date('2024-06-01T00:00:00.000Z')
    expect(reviveDateField(input)).toBe(input)
  })

  it('returns null for unsupported values', () => {
    expect(reviveDateField(null)).toBeNull()
    expect(reviveDateField(123)).toBeNull()
  })
})
