import { useMemo } from 'react'
import { isEqual } from 'lodash-es'
import { checkRequiredFields } from '../utils/checkRequiredFields.js'
import { getChangedFieldLabels } from '../utils/getChangedFieldLabels.js'

/**
 * Custom hook for check fields.
 * @param {Object.<string, any>} oldObject - The old object.
 * @param {Object.<string, any>} newObject - The new object for equal checking.
 * @param {Object.<string, any>} fullNewObject - The full new object.
 * @param {boolean} isAddNew - The add new status.
 * @param {string[]} requiredFields - The all required fields in new object.
 * @param {Object.<string, string>} [fieldLabels] - Optional key → label map for changed fields.
 * @returns {{
 *   isNotEdited: boolean,
 *   isNotRequiredFields: boolean,
 *   disabledSave: boolean,
 *   changedFieldLabels: string[],
 * }}
 */
export const useFields = (
  oldObject,
  newObject,
  fullNewObject,
  isAddNew,
  requiredFields,
  fieldLabels
) => {
  const isNotEdited = useMemo(
    () => isEqual(oldObject, newObject) && !isAddNew,
    [isAddNew, newObject, oldObject]
  )

  const isNotRequiredFields = useMemo(
    () => Array.isArray(requiredFields)
      && requiredFields.length > 0
      && !checkRequiredFields(fullNewObject, requiredFields),
    [fullNewObject, requiredFields]
  )

  const disabledSave = useMemo(() =>
    isNotEdited || isNotRequiredFields,
  [isNotEdited, isNotRequiredFields]
  )

  const changedFieldLabels = useMemo(
    () => (fieldLabels
      ? getChangedFieldLabels(oldObject, newObject, fieldLabels)
      : []),
    [fieldLabels, newObject, oldObject]
  )

  return {
    isNotEdited,
    isNotRequiredFields,
    disabledSave,
    changedFieldLabels,
  }
}