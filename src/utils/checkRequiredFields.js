import { has, isPlainObject, isEmpty } from 'lodash-es'
import { formatMessage } from '../locale/formatMessage.js'
import { getAdminKitMessages } from '../locale/runtime.js'

export const checkRequiredFields = (data, requiredFields) => {
  const m = getAdminKitMessages().console

  if (!data || typeof data !== 'object') {
    console.error(m.invalidData)
    return false
  }
  if (!Array.isArray(requiredFields) || requiredFields.length === 0) {
    console.error(m.invalidRequiredFields)
    return false
  }

  for (const field of requiredFields) {
    if (!has(data, field)) {
      console.warn(formatMessage(m.fieldMissing, { field }))
      return false
    }

    const value = data[field]

    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (isPlainObject(value) && isEmpty(value))) {
      console.warn(formatMessage(m.fieldEmptyOrInvalid, { field }))
      return false
    }
  }

  return true
}
