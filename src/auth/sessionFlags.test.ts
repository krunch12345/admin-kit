import {
  SESSION_FLAG_KEY,
  clearSessionFlags,
  hasPersistedSession,
  isRememberMeSession,
  persistSessionFlag,
} from './sessionFlags'

afterEach(() => {
  clearSessionFlags()
  localStorage.clear()
  sessionStorage.clear()
})

describe('sessionFlags', () => {
  it('stores remember-me sessions only in localStorage', () => {
    persistSessionFlag(true)

    expect(localStorage.getItem(SESSION_FLAG_KEY)).toBe('true')
    expect(sessionStorage.getItem(SESSION_FLAG_KEY)).toBeNull()
    expect(hasPersistedSession()).toBe(true)
    expect(isRememberMeSession()).toBe(true)
  })

  it('stores non-remember sessions only in sessionStorage', () => {
    persistSessionFlag(false)

    expect(sessionStorage.getItem(SESSION_FLAG_KEY)).toBe('true')
    expect(localStorage.getItem(SESSION_FLAG_KEY)).toBeNull()
    expect(hasPersistedSession()).toBe(true)
    expect(isRememberMeSession()).toBe(false)
  })

  it('clears both stores', () => {
    persistSessionFlag(true)
    persistSessionFlag(false)
    clearSessionFlags()

    expect(hasPersistedSession()).toBe(false)
    expect(isRememberMeSession()).toBe(false)
  })
})
