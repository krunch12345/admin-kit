import { isEqual } from 'lodash-es'

/**
 * Returns human-readable labels for keys that differ between two snapshots.
 * @param {Object.<string, any>} oldObject - Baseline values.
 * @param {Object.<string, any>} newObject - Current values.
 * @param {Object.<string, string>} [labelMap] - Field key → display label.
 * @returns {string[]}
 */
export const getChangedFieldLabels = (oldObject = {}, newObject = {}, labelMap = {}) => {
  const keys = [
    ...Object.keys(oldObject),
    ...Object.keys(newObject).filter((key) => !(key in oldObject)),
  ]

  return keys
    .filter((key) => !isEqual(oldObject[key], newObject[key]))
    .map((key) => labelMap[key] ?? key)
}
