import { COMPRESSION_SERVER } from './constants'
import type {
  CompressionMode,
  EmptyMeta,
  PendingImage,
  UploadFailure,
  UploadFnResult,
  UploadMeta,
  UploadedImage,
} from './types'

export type { PendingImage } from './types'

export const createPendingImageId = (): string => (
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`
)

export const readFileAsDataUrl = (file: Blob): Promise<string> => new Promise<string>((resolve) => {
  const reader = new FileReader()

  reader.onloadend = () => {
    resolve(typeof reader.result === 'string' ? reader.result : '')
  }
  reader.readAsDataURL(file)
})

export const toUploadedImagePayload = (succeeded: UploadedImage): UploadedImage => {
  if (!succeeded || typeof succeeded !== 'object') {
    return succeeded
  }

  const { clientIndex: _clientIndex, ...image } = succeeded

  return image
}

export interface NormalizedUploadResult {
  succeeded: UploadedImage[]
  failed: UploadFailure[]
}

export const normalizeUploadResult = (result: UploadFnResult | null | undefined): NormalizedUploadResult => {
  if (Array.isArray(result)) {
    return { succeeded: result, failed: [] }
  }

  return {
    succeeded: Array.isArray(result?.succeeded) ? result.succeeded : [],
    failed: Array.isArray(result?.failed) ? result.failed : [],
  }
}

export interface BuildUploadMetaOptions {
  withMeta: boolean
  createUniqueName: boolean
  multiple: boolean
  compression: CompressionMode
  emptyMeta: EmptyMeta
}

export const buildUploadMeta = (
  item: PendingImage,
  { withMeta, createUniqueName, multiple, compression, emptyMeta }: BuildUploadMetaOptions,
): UploadMeta => {
  const meta: UploadMeta = {}
  const itemFields: Record<string, unknown> = { ...item }
  const includeFileName = withMeta || !createUniqueName || !multiple

  if (includeFileName && item.fileName) {
    meta.fileName = item.fileName
  }

  if (withMeta) {
    for (const field of Object.keys(emptyMeta)) {
      if (itemFields[field]) {
        meta[field] = itemFields[field]
      }
    }
  }

  if (item.skipCompression) {
    meta.skipCompression = true
  } else if (compression === COMPRESSION_SERVER) {
    meta.mode = item.compressionMode
  }

  return meta
}
