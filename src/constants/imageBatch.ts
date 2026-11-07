/** Hard limit per HTTP batch request (backend). */
export const BATCH_IMAGE_HARD_LIMIT = 25

/**
 * Soft cap for total multipart body size per upload chunk (bytes).
 * Stays under a common nginx `client_max_body_size 20m` with headroom for form fields.
 */
export const BATCH_IMAGE_MAX_BYTES = 18 * 1024 * 1024

/** Soft limit for pending images in the admin upload dialog (UI only). */
export const BATCH_IMAGE_SOFT_LIMIT = 150

export interface ChunkByCountAndBytesOptions<T> {
  maxCount?: number
  maxBytes?: number
  getSize?: (item: T) => number
}

/**
 * Splits an array into chunks of at most `size` items.
 */
export const chunkArray = <T>(
  items: readonly T[] | null | undefined,
  size: number = BATCH_IMAGE_HARD_LIMIT,
): T[][] => {
  if (!Array.isArray(items) || items.length === 0) {
    return []
  }

  const chunkSize = size > 0 ? size : BATCH_IMAGE_HARD_LIMIT
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize))
  }

  return chunks
}

const isFiniteNumber = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value)
)

/**
 * Default size reader for pending upload items or File-like objects.
 */
export const getUploadItemByteSize = (item: unknown): number => {
  if (!item || typeof item !== 'object') {
    return 0
  }

  const { size, file } = item as { size?: unknown, file?: { size?: unknown } | null }

  if (isFiniteNumber(size)) {
    return Math.max(0, size)
  }

  if (file && isFiniteNumber(file.size)) {
    return Math.max(0, file.size)
  }

  return 0
}

/**
 * Packs items into chunks limited by count and total byte size.
 * A single item larger than `maxBytes` becomes its own chunk (may still need a proxy raise).
 */
export const chunkFilesByCountAndBytes = <T>(
  items: readonly T[] | null | undefined,
  {
    maxCount = BATCH_IMAGE_HARD_LIMIT,
    maxBytes = BATCH_IMAGE_MAX_BYTES,
    getSize = getUploadItemByteSize,
  }: ChunkByCountAndBytesOptions<T> = {},
): T[][] => {
  if (!Array.isArray(items) || items.length === 0) {
    return []
  }

  const countLimit = maxCount > 0 ? maxCount : BATCH_IMAGE_HARD_LIMIT
  const bytesLimit = maxBytes > 0 ? maxBytes : BATCH_IMAGE_MAX_BYTES
  const chunks: T[][] = []
  let current: T[] = []
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
