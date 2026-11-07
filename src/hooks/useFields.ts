import { useMemo } from 'react'
import { isEqual } from 'lodash-es'
import { checkRequiredFields } from '../utils/checkRequiredFields'
import { getChangedFieldLabels } from '../utils/getChangedFieldLabels'

type FieldsObject = Record<string, unknown>

export interface UseFieldsResult {
  isNotEdited: boolean
  isNotRequiredFields: boolean
  disabledSave: boolean
  changedFieldLabels: string[]
}

/**
 * Custom hook for check fields.
 * @param oldObject - The old object.
 * @param newObject - The new object for equal checking.
 * @param fullNewObject - The full new object.
 * @param isAddNew - The add new status.
 * @param requiredFields - The all required fields in new object.
 * @param fieldLabels - Optional key → label map for changed fields.
 */
export const useFields = (
  oldObject: FieldsObject | null | undefined,
  newObject: FieldsObject | null | undefined,
  fullNewObject: FieldsObject | null | undefined,
  isAddNew: boolean,
  requiredFields?: string[],
  fieldLabels?: Record<string, string>,
): UseFieldsResult => {
  const isNotEdited = useMemo(
    () => isEqual(oldObject, newObject) && !isAddNew,
    [isAddNew, newObject, oldObject],
  )

  const isNotRequiredFields = useMemo(
    () => Array.isArray(requiredFields)
      && requiredFields.length > 0
      && !checkRequiredFields(fullNewObject, requiredFields),
    [fullNewObject, requiredFields],
  )

  const disabledSave = useMemo(
    () => isNotEdited || isNotRequiredFields,
    [isNotEdited, isNotRequiredFields],
  )

  const changedFieldLabels = useMemo(
    () => (fieldLabels
      ? getChangedFieldLabels(oldObject ?? undefined, newObject ?? undefined, fieldLabels)
      : []),
    [fieldLabels, newObject, oldObject],
  )

  return {
    isNotEdited,
    isNotRequiredFields,
    disabledSave,
    changedFieldLabels,
  }
}
