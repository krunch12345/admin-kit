import { isEqual, isNil, isArray } from 'lodash-es'

/**
 * Absolute "filled" check (legacy helper).
 * Treats false / 0 / '' / null / undefined / [] as empty.
 * @param {*} value
 * @returns {boolean}
 */
const isNonEmpty = (value) =>
  !isNil(value)
  && value !== ''
  && value !== 0
  && value !== false
  && (!isArray(value) || value.length > 0)

/**
 * Counts filter values that differ from their init defaults.
 * Prefer this for FilterBar badges so defaults like `false` / `0` do not look "active".
 * @param {Object} filters
 * @param {Object} [initFilters]
 * @returns {number}
 */
export const countNonEmptyFilters = (filters, initFilters) => {
  if (!filters || typeof filters !== 'object') {
    return 0
  }

  if (!initFilters || typeof initFilters !== 'object') {
    return Object.values(filters).filter(isNonEmpty).length
  }

  return Object.keys(filters).filter((key) => !isEqual(filters[key], initFilters[key])).length
}
