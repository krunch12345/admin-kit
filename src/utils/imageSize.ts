import { formatMessage } from '../locale/formatMessage'
import { getAdminKitMessages } from '../locale/runtime'
import { getImageFetchAttempts } from './getProxiedImageFetchUrl'

export interface ImageDimensions {
  width: number
  height: number
}

export interface ImageSizeInfo {
  width?: number | null
  height?: number | null
  bytes?: number | null
}

const byteSizeCache = new Map<string, number | null>()

const getByteSizeCacheKey = (url: string): string => {
  try {
    const parsed = new URL(url, window.location.origin)
    parsed.search = ''
    parsed.hash = ''
    return parsed.href
  } catch {
    return url.split('?')[0]?.split('#')[0] ?? url
  }
}

/**
 * Clears cached Content-Length for a URL (ignores query/hash).
 */
export const clearImageByteSizeCache = (url?: string): void => {
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
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
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
 * @param {number|null|undefined} height
 */
export const formatImageDimensions = (
  width: number | null | undefined,
  height: number | null | undefined,
): string => {
  if (!width || !height) {
    return ''
  }

  return `${Math.round(width)}×${Math.round(height)}`
}

/**
 * Builds compact label: "1920×1080 · 245 KB".
 * @param {{ width?: number|null, height?: number|null, bytes?: number|null }} info
 */
export const formatImageSizeLabel = ({ width, height, bytes }: ImageSizeInfo = {}): string => {
  const parts = [
    formatImageDimensions(width, height),
    formatFileSize(bytes),
  ].filter(Boolean)

  return parts.join(' · ')
}

/**
 * Reads natural dimensions from an image source.
 * @returns {Promise<{ width: number, height: number }|null>}
 */
export const loadImageDimensions = (src: string | null | undefined): Promise<ImageDimensions | null> => {
  if (!src) {
    return Promise.resolve(null)
  }

  return new Promise<ImageDimensions | null>((resolve) => {
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
 */
export const fetchImageByteSize = async (url: string | null | undefined): Promise<number | null> => {
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
