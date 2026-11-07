const DEFAULT_TTL_MS = 14 * 24 * 60 * 60 * 1000

/**
 * @typedef {object} FormDraftStorageOptions
 * @property {string} prefix - localStorage key prefix, e.g. `postDraft:` or `placeDraft:`.
 * @property {number} [ttlMs] - Draft time-to-live (default 14 days).
 */

/**
 * @param {unknown} draft
 * @param {number} ttlMs
 * @returns {boolean}
 */
const isDraftExpired = (draft, ttlMs) => {
  if (!draft || typeof draft !== 'object' || !('savedAt' in draft) || !draft.savedAt) {
    return true
  }

  const savedAt = new Date(draft.savedAt).getTime()

  if (Number.isNaN(savedAt)) {
    return true
  }

  return Date.now() - savedAt > ttlMs
}

/**
 * Creates a namespaced localStorage draft API for edit forms.
 * Stored shape: `{ savedAt: string, ...payload }`.
 * @param {FormDraftStorageOptions} options
 */
export const createFormDraftStorage = ({
  prefix,
  ttlMs = DEFAULT_TTL_MS,
}) => {
  if (!prefix || typeof prefix !== 'string') {
    throw new Error('createFormDraftStorage requires a non-empty prefix')
  }

  /**
   * @param {string} entityId
   * @returns {string}
   */
  const getKey = (entityId) => `${prefix}${entityId}`

  /**
   * Removes expired drafts for this prefix.
   */
  const clearExpired = () => {
    try {
      const keysToRemove = []

      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i)

        if (!key?.startsWith(prefix)) {
          continue
        }

        try {
          const draft = JSON.parse(localStorage.getItem(key))

          if (isDraftExpired(draft, ttlMs)) {
            keysToRemove.push(key)
          }
        } catch {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key))
    } catch {
      // Ignore quota / private mode failures.
    }
  }

  /**
   * @param {string} entityId
   * @returns {object | null}
   */
  const get = (entityId) => {
    if (!entityId) {
      return null
    }

    try {
      const raw = localStorage.getItem(getKey(entityId))

      if (!raw) {
        return null
      }

      const draft = JSON.parse(raw)

      if (isDraftExpired(draft, ttlMs)) {
        localStorage.removeItem(getKey(entityId))
        return null
      }

      return draft
    } catch {
      return null
    }
  }

  /**
   * @param {string} entityId
   * @param {Record<string, unknown>} payload
   */
  const save = (entityId, payload) => {
    if (!entityId || !payload || typeof payload !== 'object') {
      return
    }

    try {
      localStorage.setItem(getKey(entityId), JSON.stringify({
        ...payload,
        savedAt: new Date().toISOString(),
      }))
    } catch {
      // Ignore quota / private mode write failures.
    }
  }

  /**
   * @param {string} entityId
   */
  const clear = (entityId) => {
    if (!entityId) {
      return
    }

    try {
      localStorage.removeItem(getKey(entityId))
    } catch {
      // Ignore storage failures.
    }
  }

  return {
    prefix,
    ttlMs,
    getKey,
    clearExpired,
    get,
    save,
    clear,
  }
}

export const FORM_DRAFT_DEFAULT_TTL_MS = DEFAULT_TTL_MS
