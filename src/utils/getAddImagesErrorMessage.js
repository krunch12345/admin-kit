const PROXY_413_MESSAGE = (
  'Обратный прокси отклонил тело запроса (HTTP 413). '
  + 'Увеличьте nginx client_max_body_size (например, 256m).'
)

/**
 * @param {unknown} value
 * @returns {string}
 */
const asText = (value) => {
  if (typeof value === 'string') {
    return value
  }

  if (value === null) {
    return ''
  }

  return String(value)
}

/**
 * @param {unknown} data
 * @returns {boolean}
 */
export const isAppFileTooLargePayload = (data) => {
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

  const code = asText(data.code || data.errorCode).toUpperCase()
  if (code === 'FILE_TOO_LARGE' || code.includes('FILE_TOO_LARGE')) {
    return true
  }

  const error = asText(data.error)
  const message = asText(data.message)
  const combined = `${error} ${message}`.toLowerCase()

  return combined.includes('file too large')
    || combined.includes('файл слишком большой')
}

/**
 * Human-readable message for addImages / upload failures.
 * Distinguishes nginx/proxy plain-text 413 from app multer FILE_TOO_LARGE JSON.
 *
 * @param {unknown} err - RTK Query / fetch error
 * @returns {string}
 */
export const getAddImagesErrorMessage = (err) => {
  const status = err?.status ?? err?.originalStatus
  const data = err?.data

  if (status === 413 && !isAppFileTooLargePayload(data)) {
    return PROXY_413_MESSAGE
  }

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message
    }

    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error
    }
  }

  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message
  }

  try {
    return JSON.stringify(err)
  } catch {
    return 'Ошибка загрузки изображений'
  }
}
