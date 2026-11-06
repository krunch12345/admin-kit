/** Hard limit per HTTP batch request (backend). */
export const BATCH_IMAGE_HARD_LIMIT = 25

/**
 * Soft cap for total multipart body size per upload chunk (bytes).
 * Stays under a common nginx `client_max_body_size 20m` with headroom for form fields.
 */
export const BATCH_IMAGE_MAX_BYTES = 18 * 1024 * 1024

/** Soft limit for pending images in the admin upload dialog (UI only). */
export const BATCH_IMAGE_SOFT_LIMIT = 150

/**
 * Splits an array into chunks of at most `size` items.
 * @template T
 * @param {T[]} items
 * @param {number} [size=BATCH_IMAGE_HARD_LIMIT]
 * @returns {T[][]}
 */
export const chunkArray = (items, size = BATCH_IMAGE_HARD_LIMIT) => {
  if (!Array.isArray(items) || items.length === 0) {
    return []
  }

  const chunkSize = size > 0 ? size : BATCH_IMAGE_HARD_LIMIT
  const chunks = []

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize))
  }

  return chunks
}

/**
 * Default size reader for pending upload items or File-like objects.
 * @param {unknown} item
 * @returns {number}
 */
export const getUploadItemByteSize = (item) => {
  if (!item || typeof item !== 'object') {
    return 0
  }

  if (typeof item.size === 'number' && Number.isFinite(item.size)) {
    return Math.max(0, item.size)
  }

  if (item.file && typeof item.file.size === 'number' && Number.isFinite(item.file.size)) {
    return Math.max(0, item.file.size)
  }

  return 0
}

/**
 * Packs items into chunks limited by count and total byte size.
 * A single item larger than `maxBytes` becomes its own chunk (may still need a proxy raise).
 *
 * @template T
 * @param {T[]} items
 * @param {{
 *   maxCount?: number,
 *   maxBytes?: number,
 *   getSize?: (item: T) => number,
 * }} [options]
 * @returns {T[][]}
 */
export const chunkFilesByCountAndBytes = (
  items,
  {
    maxCount = BATCH_IMAGE_HARD_LIMIT,
    maxBytes = BATCH_IMAGE_MAX_BYTES,
    getSize = getUploadItemByteSize,
  } = {},
) => {
  if (!Array.isArray(items) || items.length === 0) {
    return []
  }

  const countLimit = maxCount > 0 ? maxCount : BATCH_IMAGE_HARD_LIMIT
  const bytesLimit = maxBytes > 0 ? maxBytes : BATCH_IMAGE_MAX_BYTES
  const chunks = []
  let current = []
  let currentBytes = 0

  for (const item of items) {
    const size = Math.max(0, Number(getSize(item)) || 0)
    const wouldExceedCount = current.length >= countLimit
    const wouldExceedBytes = current.length > 0 && currentBytes + size > bytesLimit

    if (wouldExceedCount || wouldExceedBytes) {
      chunks.push(current)
      current = []
      currentBytes = 0
    }

    current.push(item)
    currentBytes += size
  }

  if (current.length) {
    chunks.push(current)
  }

  return chunks
}
