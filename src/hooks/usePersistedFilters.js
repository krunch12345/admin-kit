import { useEffect, useState } from 'react'

/**
 * Restores filter values from storage, reviving Date fields from ISO strings.
 * @param {Object} stored - Parsed stored filters.
 * @param {Object} initFilters - Default filters shape.
 * @returns {Object}
 */
const reviveFilters = (stored, initFilters) => {
  if (!stored || typeof stored !== 'object') {
    return initFilters
  }

  const next = { ...initFilters, ...stored }

  Object.keys(initFilters).forEach((key) => {
    const initValue = initFilters[key]
    const isDateField = initValue === null
      || Object.prototype.toString.call(initValue) === '[object Date]'

    if (!isDateField) {
      return
    }

    const raw = stored[key]

    if (typeof raw === 'string') {
      const date = new Date(raw)
      next[key] = Number.isNaN(date.getTime()) ? null : date
      return
    }

    next[key] = raw ?? null
  })

  return next
}

/**
 * Persists list filters in sessionStorage across create/edit navigation.
 * @param {string} storageKey - Unique key per list page.
 * @param {Object} initFilters - Default filter values.
 * @returns {[Object, function]} Filters state and setter.
 */
export const usePersistedFilters = (storageKey, initFilters) => {
  const [filters, setFilters] = useState(() => {
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
