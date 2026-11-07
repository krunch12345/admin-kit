import { createFormDraftStorage, FORM_DRAFT_DEFAULT_TTL_MS } from './formDraftStorage'

afterEach(() => {
  localStorage.clear()
})

describe('createFormDraftStorage', () => {
  it('throws when prefix is missing', () => {
    expect(() => createFormDraftStorage({ prefix: '' })).toThrow(/prefix/)
  })

  it('saves and reads a draft payload with savedAt', () => {
    const storage = createFormDraftStorage({ prefix: 'placeDraft:' })

    storage.save('add-new', { name: 'Cafe' })

    const draft = storage.get('add-new')
    expect(draft).toMatchObject({ name: 'Cafe' })
    expect(typeof draft?.savedAt).toBe('string')
    expect(localStorage.getItem(storage.getKey('add-new'))).not.toBeNull()
  })

  it('clears a draft by entity id', () => {
    const storage = createFormDraftStorage({ prefix: 'placeDraft:' })

    storage.save('42', { name: 'Cafe' })
    storage.clear('42')

    expect(storage.get('42')).toBeNull()
  })

  it('returns null for expired drafts and removes them', () => {
    const storage = createFormDraftStorage({
      prefix: 'placeDraft:',
      ttlMs: 1000,
    })

    localStorage.setItem(storage.getKey('42'), JSON.stringify({
      name: 'Old',
      savedAt: new Date(Date.now() - 5000).toISOString(),
    }))

    expect(storage.get('42')).toBeNull()
    expect(localStorage.getItem(storage.getKey('42'))).toBeNull()
  })

  it('clearExpired removes only expired keys for the prefix', () => {
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

    expect(localStorage.getItem('placeDraft:old')).toBeNull()
    expect(JSON.parse(localStorage.getItem('placeDraft:fresh') ?? 'null').name).toBe('Fresh')
    expect(localStorage.getItem('otherDraft:x')).not.toBeNull()
  })

  it('exposes default ttl constant', () => {
    expect(FORM_DRAFT_DEFAULT_TTL_MS).toBe(14 * 24 * 60 * 60 * 1000)
  })
})
