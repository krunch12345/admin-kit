import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import { createFormDraftStorage, FORM_DRAFT_DEFAULT_TTL_MS } from './formDraftStorage.js'

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
    get length() {
      return map.size
    },
    key: (index) => [...map.keys()][index] ?? null,
  }
}

afterEach(() => {
  delete globalThis.localStorage
})

describe('createFormDraftStorage', () => {
  it('throws when prefix is missing', () => {
    assert.throws(() => createFormDraftStorage({ prefix: '' }), /prefix/)
  })

  it('saves and reads a draft payload with savedAt', () => {
    globalThis.localStorage = memoryStore()
    const storage = createFormDraftStorage({ prefix: 'placeDraft:' })

    storage.save('add-new', { name: 'Cafe' })

    const draft = storage.get('add-new')
    assert.equal(draft.name, 'Cafe')
    assert.equal(typeof draft.savedAt, 'string')
    assert.equal(localStorage.getItem(storage.getKey('add-new')) !== null, true)
  })

  it('clears a draft by entity id', () => {
    globalThis.localStorage = memoryStore()
    const storage = createFormDraftStorage({ prefix: 'placeDraft:' })

    storage.save('42', { name: 'Cafe' })
    storage.clear('42')

    assert.equal(storage.get('42'), null)
  })

  it('returns null for expired drafts and removes them', () => {
    globalThis.localStorage = memoryStore()
    const storage = createFormDraftStorage({
      prefix: 'placeDraft:',
      ttlMs: 1000,
    })

    localStorage.setItem(storage.getKey('42'), JSON.stringify({
      name: 'Old',
      savedAt: new Date(Date.now() - 5000).toISOString(),
    }))

    assert.equal(storage.get('42'), null)
    assert.equal(localStorage.getItem(storage.getKey('42')), null)
  })

  it('clearExpired removes only expired keys for the prefix', () => {
    globalThis.localStorage = memoryStore()
    const storage = createFormDraftStorage({
      prefix: 'placeDraft:',
      ttlMs: 1000,
    })

    localStorage.setItem('placeDraft:old', JSON.stringify({
      name: 'Old',
      savedAt: new Date(Date.now() - 5000).toISOString(),
    }))
    localStorage.setItem('placeDraft:fresh', JSON.stringify({
      name: 'Fresh',
      savedAt: new Date().toISOString(),
    }))
    localStorage.setItem('otherDraft:x', JSON.stringify({
      name: 'Other',
      savedAt: new Date(Date.now() - 5000).toISOString(),
    }))

    storage.clearExpired()

    assert.equal(localStorage.getItem('placeDraft:old'), null)
    assert.equal(JSON.parse(localStorage.getItem('placeDraft:fresh')).name, 'Fresh')
    assert.equal(localStorage.getItem('otherDraft:x') !== null, true)
  })

  it('exposes default ttl constant', () => {
    assert.equal(FORM_DRAFT_DEFAULT_TTL_MS, 14 * 24 * 60 * 60 * 1000)
  })
})
