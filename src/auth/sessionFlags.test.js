import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import {
  SESSION_FLAG_KEY,
  clearSessionFlags,
  hasPersistedSession,
  isRememberMeSession,
  persistSessionFlag,
} from './sessionFlags.js'

const memoryStore = () => {
  const map = new Map()
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
    clear: () => {
      map.clear()
    },
  }
}

afterEach(() => {
  clearSessionFlags()
  delete globalThis.window
  delete globalThis.localStorage
  delete globalThis.sessionStorage
})

describe('sessionFlags', () => {
  it('stores remember-me sessions only in localStorage', () => {
    globalThis.localStorage = memoryStore()
    globalThis.sessionStorage = memoryStore()
    globalThis.window = globalThis

    persistSessionFlag(true)

    assert.equal(localStorage.getItem(SESSION_FLAG_KEY), 'true')
    assert.equal(sessionStorage.getItem(SESSION_FLAG_KEY), null)
    assert.equal(hasPersistedSession(), true)
    assert.equal(isRememberMeSession(), true)
  })

  it('stores non-remember sessions only in sessionStorage', () => {
    globalThis.localStorage = memoryStore()
    globalThis.sessionStorage = memoryStore()
    globalThis.window = globalThis

    persistSessionFlag(false)

    assert.equal(sessionStorage.getItem(SESSION_FLAG_KEY), 'true')
    assert.equal(localStorage.getItem(SESSION_FLAG_KEY), null)
    assert.equal(hasPersistedSession(), true)
    assert.equal(isRememberMeSession(), false)
  })

  it('clears both stores', () => {
    globalThis.localStorage = memoryStore()
    globalThis.sessionStorage = memoryStore()
    globalThis.window = globalThis

    persistSessionFlag(true)
    persistSessionFlag(false)
    clearSessionFlags()

    assert.equal(hasPersistedSession(), false)
    assert.equal(isRememberMeSession(), false)
  })
})
