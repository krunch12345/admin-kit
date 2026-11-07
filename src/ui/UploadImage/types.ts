import type { ImageMetaValues } from '../ImageMetaFields/ImageMetaFields'

export type CompressionMode = 'client' | 'server' | 'none'

export type ServerCompressionMode = 'gentle' | 'aggressive'

export interface PendingImage extends ImageMetaValues {
  id: string
  file: File
  imageSrc: string
  fileName: string
  skipCompression: boolean
  compressionMode: ServerCompressionMode
}

export type PendingImagePatch = Partial<Omit<PendingImage, 'id'>>

export type EmptyMeta = Record<string, string>

export interface UploadLimits {
  softLimit: number
  hardLimit: number
  maxBytes: number
}

export interface UploadContext {
  type: string
  folder?: string
  createUniqueName: boolean
}

/** Per-file meta sent to `uploadFn`: fileName, skipCompression, mode (server compression), meta fields. */
export type UploadMeta = Record<string, unknown>

export interface UploadFnArgs {
  files: File[]
  metas: UploadMeta[]
  context: UploadContext
}

export type UploadedImage = Record<string, unknown>

export interface UploadFailure {
  clientIndex?: number
  message?: string
}

export interface UploadSuccessResult {
  succeeded: UploadedImage[]
  failed?: UploadFailure[]
}

export type UploadFnResult = UploadSuccessResult | UploadedImage[]

export type UploadFn = (args: UploadFnArgs) => Promise<UploadFnResult>

export type OptimizeImageFn = (file: File, options: { skipCompression?: boolean }) => Promise<File>

export interface BulkUpdateResult {
  failedIds?: string[]
}

export interface CopyFieldsParams {
  sourceId: string
  targetIds: string[]
  fieldKeys: string[]
}

export type ApplyBulkUpdateHandler = (
  ids: string[],
  partial: PendingImagePatch,
) => void | BulkUpdateResult | Promise<void | BulkUpdateResult>

export type CopyFieldsHandler = (
  params: CopyFieldsParams,
) => void | BulkUpdateResult | Promise<void | BulkUpdateResult>

export interface GeneralSettingsState {
  isOpen: boolean
  isDirty: boolean
  session: number
  open: () => void
  close: () => void
  setIsDirty: (isDirty: boolean) => void
}
