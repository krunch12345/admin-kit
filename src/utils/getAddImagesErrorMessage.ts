import { getAdminKitMessages } from '../locale/runtime'

const toRecord = (value: unknown): Record<string, unknown> => (
  value !== null && typeof value === 'object' ? value as Record<string, unknown> : {}
)

const asText = (value: unknown): string => {
  if (typeof value === 'string') {
    return value
  }

  if (value === null) {
    return ''
  }

  return String(value)
}

const isNonEmptyString = (value: unknown): value is string => (
  typeof value === 'string' && value.trim().length > 0
)

export const isAppFileTooLargePayload = (data: unknown): boolean => {
  if (data === null) {
    return false
  }

  if (typeof data === 'string') {
    const text = data.toLowerCase()
    return text.includes('file too large')
      || text.includes('файл слишком большой')
  }

  if (typeof data !== 'object') {
    return false
  }

  const payload = toRecord(data)
  const code = asText(payload.code || payload.errorCode).toUpperCase()
  if (code === 'FILE_TOO_LARGE' || code.includes('FILE_TOO_LARGE')) {
    return true
  }

  const error = asText(payload.error)
  const message = asText(payload.message)
  const combined = `${error} ${message}`.toLowerCase()

  return combined.includes('file too large')
    || combined.includes('файл слишком большой')
}

/**
 * Human-readable message for addImages / upload failures.
 * Distinguishes nginx/proxy plain-text 413 from app multer FILE_TOO_LARGE JSON.
 *
 * @param err - RTK Query / fetch error
 */
export const getAddImagesErrorMessage = (err: unknown): string => {
  const error = toRecord(err)
  const status = error.status ?? error.originalStatus
  const { data } = error
  const messages = getAdminKitMessages()

  if (status === 413 && !isAppFileTooLargePayload(data)) {
    return messages.errors.proxy413
  }

  if (isNonEmptyString(data)) {
    return data
  }

  if (data && typeof data === 'object') {
    const payload = toRecord(data)

    if (isNonEmptyString(payload.message)) {
      return payload.message
    }

    if (isNonEmptyString(payload.error)) {
      return payload.error
    }
  }

  if (isNonEmptyString(error.message)) {
    return error.message
  }

  try {
    return JSON.stringify(err)
  } catch {
    return messages.errors.uploadFallback
  }
}
