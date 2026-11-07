const DEFAULT_TTL_MS = 14 * 24 * 60 * 60 * 1000

export interface FormDraftStorageOptions {
  /** localStorage key prefix, e.g. `postDraft:` or `placeDraft:`. */
  prefix: string
  /** Draft time-to-live (default 14 days). */
  ttlMs?: number
}

export type FormDraft<Payload extends object = Record<string, unknown>> = Payload & {
  savedAt: string
}

export interface FormDraftStorage {
  prefix: string
  ttlMs: number
  getKey: (entityId: string) => string
  clearExpired: () => void
  get: <Payload extends object = Record<string, unknown>>(entityId: string | null | undefined) => FormDraft<Payload> | null
  save: (entityId: string | null | undefined, payload: Record<string, unknown>) => void
  clear: (entityId: string | null | undefined) => void
}

const isDraftExpired = (draft: unknown, ttlMs: number): boolean => {
  if (!draft || typeof draft !== 'object' || !('savedAt' in draft) || !draft.savedAt) {
    return true
  }

  const savedAt = new Date(draft.savedAt as string).getTime()

  if (Number.isNaN(savedAt)) {
    return true
  }

  return Date.now() - savedAt > ttlMs
}

/**
 * Creates a namespaced localStorage draft API for edit forms.
 * Stored shape: `{ savedAt: string, ...payload }`.
 */
export const createFormDraftStorage = ({
  prefix,
  ttlMs = DEFAULT_TTL_MS,
}: FormDraftStorageOptions): FormDraftStorage => {
  if (!prefix || typeof prefix !== 'string') {
    throw new Error('createFormDraftStorage requires a non-empty prefix')
  }

  const getKey = (entityId: string): string => `${prefix}${entityId}`

  /**
   * Removes expired drafts for this prefix.
   */
  const clearExpired = (): void => {
    try {
      const keysToRemove: string[] = []

      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i)

        if (!key?.startsWith(prefix)) {
          continue
        }

        try {
          const draft: unknown = JSON.parse(localStorage.getItem(key) ?? 'null')

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

  const get: FormDraftStorage['get'] = <Payload extends object = Record<string, unknown>>(
    entityId: string | null | undefined,
  ) => {
    if (!entityId) {
      return null
    }

    try {
      const raw = localStorage.getItem(getKey(entityId))

      if (!raw) {
        return null
      }

      const draft: unknown = JSON.parse(raw)

      if (isDraftExpired(draft, ttlMs)) {
        localStorage.removeItem(getKey(entityId))
        return null
      }

      return draft as FormDraft<Payload>
    } catch {
      return null
    }
  }

  const save: FormDraftStorage['save'] = (entityId, payload) => {
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

  const clear: FormDraftStorage['clear'] = (entityId) => {
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
