import { formatMessage } from '../locale/formatMessage.js'
import { getAdminKitMessages } from '../locale/runtime.js'
import { getImageFetchAttempts } from './getProxiedImageFetchUrl.js'

/** @type {Map<string, number|null>} */
const byteSizeCache = new Map()

/**
 * @param {string} url
 * @returns {string}
 */
const getByteSizeCacheKey = (url) => {
  try {
    const parsed = new URL(url, window.location.origin)
    parsed.search = ''
    parsed.hash = ''
    return parsed.href
  } catch {
    return url.split('?')[0].split('#')[0]
  }
}

/**
 * Clears cached Content-Length for a URL (ignores query/hash).
 * @param {string} [url]
 */
export const clearImageByteSizeCache = (url) => {
  if (!url) {
    byteSizeCache.clear()
    return
  }

  const key = getByteSizeCacheKey(url)

  for (const cachedUrl of byteSizeCache.keys()) {
    if (getByteSizeCacheKey(cachedUrl) === key) {
      byteSizeCache.delete(cachedUrl)
    }
  }
}

/**
 * Formats byte count for compact UI (e.g. "245 KB", "1.2 MB").
 * @param {number|null|undefined} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes) || bytes < 0) {
    return ''
  }

  const messages = getAdminKitMessages().fileSize

  if (bytes < 1024) {
    return formatMessage(messages.bytes, { value: String(bytes) })
  }

  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024
    const value = kb < 10 ? kb.toFixed(1) : String(Math.round(kb))
    return formatMessage(messages.kilobytes, { value })
  }

  const mb = bytes / (1024 * 1024)
  const value = mb < 10 ? mb.toFixed(1) : String(Math.round(mb))
  return formatMessage(messages.megabytes, { value })
}

/**
 * Formats pixel dimensions (e.g. "1920×1080").
 * @param {number|null|undefined} width
 * @param {number|null|undefined} height
 * @returns {string}
 */
export const formatImageDimensions = (width, height) => {
  if (!width || !height) {
    return ''
  }

  return `${Math.round(width)}×${Math.round(height)}`
}

/**
 * Builds compact label: "1920×1080 · 245 KB".
 * @param {{ width?: number|null, height?: number|null, bytes?: number|null }} info
 * @returns {string}
 */
export const formatImageSizeLabel = ({ width, height, bytes } = {}) => {
  const parts = [
    formatImageDimensions(width, height),
    formatFileSize(bytes),
  ].filter(Boolean)

  return parts.join(' · ')
}

/**
 * Reads natural dimensions from an image source.
 * @param {string} src
 * @returns {Promise<{ width: number, height: number }|null>}
 */
export const loadImageDimensions = (src) => {
  if (!src) {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }

    img.onerror = () => {
      resolve(null)
    }

    img.src = src
  })
}

/**
 * Tries to read Content-Length via HEAD (uses image proxy when needed).
 * @param {string} url
 * @returns {Promise<number|null>}
 */
export const fetchImageByteSize = async (url) => {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
    return null
  }

  const cacheKey = getByteSizeCacheKey(url)

  if (byteSizeCache.has(cacheKey)) {
    return byteSizeCache.get(cacheKey) ?? null
  }

  const attempts = getImageFetchAttempts(url)

  for (const attemptUrl of attempts) {
    try {
      const response = await fetch(attemptUrl, {
        method: 'HEAD',
        credentials: 'omit',
        cache: 'no-store',
      })
      const contentLength = response.headers.get('content-length')

      if (response.ok && contentLength) {
        const bytes = Number(contentLength)

        if (!Number.isNaN(bytes) && bytes >= 0) {
          byteSizeCache.set(cacheKey, bytes)
          return bytes
        }
      }
    } catch {
      // try next candidate
    }
  }

  byteSizeCache.set(cacheKey, null)
  return null
}
