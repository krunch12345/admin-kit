import { isEqual } from 'lodash-es'

/**
 * Returns human-readable labels for keys that differ between two snapshots.
 *
 * @param oldObject - Baseline values.
 * @param newObject - Current values.
 * @param labelMap - Field key → display label.
 */
export const getChangedFieldLabels = (
  oldObject: Record<string, unknown> = {},
  newObject: Record<string, unknown> = {},
  labelMap: Record<string, string> = {},
): string[] => {
  const keys = [
    ...Object.keys(oldObject),
    ...Object.keys(newObject).filter((key) => !(key in oldObject)),
  ]

  return keys
    .filter((key) => !isEqual(oldObject[key], newObject[key]))
    .map((key) => labelMap[key] ?? key)
}
