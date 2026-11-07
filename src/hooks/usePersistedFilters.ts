import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { reviveDateField } from '../utils/reviveDateField'

type Filters = Record<string, unknown>

const looksLikeIsoDate = (value: unknown): boolean => (
  typeof value === 'string'
  && (/^\d{4}-\d{2}-\d{2}/.test(value) || Number.isFinite(Date.parse(value)))
)

/**
 * Restores filter values from storage, reviving Date fields from ISO strings.
 * Date revival runs when the init value is a Date, or when init is `null` and
 * the stored value looks like an ISO date (avoids corrupting string filters).
 */
const reviveFilters = <T extends Filters>(stored: unknown, initFilters: T): T => {
  if (!stored || typeof stored !== 'object') {
    return initFilters
  }

  const storedFilters = stored as Filters
  const next: Filters = { ...initFilters, ...storedFilters }

  Object.keys(initFilters).forEach((key) => {
    const initValue = initFilters[key]
    const initIsDate = Object.prototype.toString.call(initValue) === '[object Date]'
    const initIsNullDateSlot = initValue === null
    const raw = storedFilters[key]

    if (!initIsDate && !(initIsNullDateSlot && looksLikeIsoDate(raw))) {
      return
    }

    next[key] = reviveDateField(raw)
  })

  return next as T
}

/**
 * Persists list filters in sessionStorage across create/edit navigation.
 */
export const usePersistedFilters = <T extends Filters>(
  storageKey: string,
  initFilters: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [filters, setFilters] = useState<T>(() => {
    try {
      const raw = sessionStorage.getItem(storageKey)

      if (!raw) {
        return initFilters
      }

      return reviveFilters(JSON.parse(raw), initFilters)
    } catch {
      return initFilters
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(filters))
    } catch {
      // Ignore quota / private mode write failures.
    }
  }, [filters, storageKey])

  return [filters, setFilters]
}
