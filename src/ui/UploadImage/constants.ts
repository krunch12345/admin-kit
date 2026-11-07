import {
  BATCH_IMAGE_HARD_LIMIT,
  BATCH_IMAGE_MAX_BYTES,
  BATCH_IMAGE_SOFT_LIMIT,
} from '../../constants/imageBatch'
import type { CompressionMode, ServerCompressionMode, UploadLimits } from './types'

export const COMPRESSION_CLIENT: CompressionMode = 'client'
export const COMPRESSION_SERVER: CompressionMode = 'server'
export const COMPRESSION_NONE: CompressionMode = 'none'
export const COMPRESSION_MODES: CompressionMode[] = [COMPRESSION_CLIENT, COMPRESSION_SERVER, COMPRESSION_NONE]

export const SERVER_COMPRESSION_GENTLE: ServerCompressionMode = 'gentle'
export const SERVER_COMPRESSION_AGGRESSIVE: ServerCompressionMode = 'aggressive'
export const DEFAULT_SERVER_COMPRESSION_MODE: ServerCompressionMode = SERVER_COMPRESSION_GENTLE

export const DEFAULT_LIMITS: UploadLimits = {
  softLimit: BATCH_IMAGE_SOFT_LIMIT,
  hardLimit: BATCH_IMAGE_HARD_LIMIT,
  maxBytes: BATCH_IMAGE_MAX_BYTES,
}
