import { deepTrimStrings } from './deepTrimStrings'

describe('deepTrimStrings', () => {
  it('trims nested plain string values', () => {
    expect(deepTrimStrings({ email: '  a@b.c  ', nested: { name: '  x  ' } })).toEqual({ email: 'a@b.c', nested: { name: 'x' } })
  })

  it('does not trim password or token fields', () => {
    expect(deepTrimStrings({ email: '  a@b.c  ', password: '  secret  ', token: '  123  ' })).toEqual({ email: 'a@b.c', password: '  secret  ', token: '  123  ' })
  })

  it('preserves Date, File-like and FormData values', () => {
    const date = new Date('2024-01-01')
    const formData = new FormData()
    formData.append('f', '1')

    expect(deepTrimStrings(date)).toBe(date)
    expect(deepTrimStrings(formData)).toBe(formData)
    expect(deepTrimStrings({ when: date })).toEqual({ when: date })
  })

  it('trims array string items', () => {
    expect(deepTrimStrings(['  a  ', 'b'])).toEqual(['a', 'b'])
  })
})
