import { isEqual, isNil, isArray } from 'lodash-es'

export type FilterValues = Record<string, unknown>

/**
 * Absolute "filled" check (legacy helper).
 * Treats false / 0 / '' / null / undefined / [] as empty.
 */
const isNonEmpty = (value: unknown): boolean =>
  !isNil(value)
  && value !== ''
  && value !== 0
  && value !== false
  && (!isArray(value) || value.length > 0)

/**
 * Counts filter values that differ from their init defaults.
 * Prefer this for FilterBar badges so defaults like `false` / `0` do not look "active".
 */
export const countNonEmptyFilters = (filters?: FilterValues | null, initFilters?: FilterValues | null): number => {
  if (!filters || typeof filters !== 'object') {
    return 0
  }

  if (!initFilters || typeof initFilters !== 'object') {
    return Object.values(filters).filter(isNonEmpty).length
  }

  return Object.keys(filters).filter((key) => !isEqual(filters[key], initFilters[key])).length
}
