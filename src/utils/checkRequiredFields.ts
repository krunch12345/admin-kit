import { has, isPlainObject, isEmpty } from 'lodash-es'
import { formatMessage } from '../locale/formatMessage'
import { getAdminKitMessages } from '../locale/runtime'

export interface CheckRequiredFieldsOptions {
  logger?: Pick<Console, 'error' | 'warn'>
}

const isEmptyValue = (value: unknown): boolean => (
  value === null
  || value === undefined
  || (typeof value === 'string' && value.trim() === '')
  || (Array.isArray(value) && value.length === 0)
  || (isPlainObject(value) && isEmpty(value))
)

/**
 * Returns required fields that are absent or empty in `data`. Pure: no logging.
 */
export const getMissingRequiredFields = (
  data: unknown,
  requiredFields: readonly string[],
): string[] => {
  if (!Array.isArray(requiredFields)) {
    return []
  }

  if (!data || typeof data !== 'object') {
    return [...requiredFields]
  }

  const record = data as Record<string, unknown>

  return requiredFields.filter((field) => !has(record, field) || isEmptyValue(record[field]))
}

/**
 * Checks that every required field is present and non-empty.
 * Diagnostics are logged only when `logger` is provided (e.g. `console`).
 */
export const checkRequiredFields = (
  data: unknown,
  requiredFields: readonly string[],
  { logger }: CheckRequiredFieldsOptions = {},
): boolean => {
  const messages = getAdminKitMessages().console

  if (!data || typeof data !== 'object') {
    logger?.error(messages.invalidData)
    return false
  }

  if (!Array.isArray(requiredFields) || requiredFields.length === 0) {
    logger?.error(messages.invalidRequiredFields)
    return false
  }

  const [firstMissing] = getMissingRequiredFields(data, requiredFields)

  if (firstMissing === undefined) {
    return true
  }

  const message = has(data, firstMissing)
    ? messages.fieldEmptyOrInvalid
    : messages.fieldMissing

  logger?.warn(formatMessage(message, { field: firstMissing }))
  return false
}
