import { useCallback, useState } from 'react'
import { chunkFilesByCountAndBytes } from '../../../constants/imageBatch'
import { useLoading } from '../../../hooks/useLoading'
import { useNotify } from '../../../hooks/useNotify'
import { getAddImagesErrorMessage } from '../../../utils/getAddImagesErrorMessage'
import { formatMessage } from '../../../locale/formatMessage'
import { useAdminKitMessages } from '../../../locale/useAdminKitMessages'
import { COMPRESSION_CLIENT } from '../constants'
import {
  buildUploadMeta,
  normalizeUploadResult,
  toUploadedImagePayload,
} from '../uploadHelpers'
import type {
  CompressionMode,
  EmptyMeta,
  OptimizeImageFn,
  PendingImage,
  UploadContext,
  UploadFailure,
  UploadFn,
  UploadLimits,
  UploadedImage,
} from '../types'

const getFailedClientItems = (chunk: PendingImage[], failedItems: UploadFailure[]): PendingImage[] => (
  failedItems
    .map((failedItem) => (failedItem.clientIndex === undefined ? undefined : chunk[failedItem.clientIndex]))
    .filter((item): item is PendingImage => Boolean(item))
)

interface UploadErrorLike {
  data?: {
    failed?: UploadFailure[]
    succeeded?: UploadedImage[]
  }
}

export interface UseBatchUploadOptions {
  pendingImages: PendingImage[]
  uploadFn: UploadFn
  /** Called once per uploaded image with the payload returned by `uploadFn`. */
  setUrl: (image: UploadedImage) => void
  optimizeImageForUpload: OptimizeImageFn
  compression: CompressionMode
  limits: Pick<UploadLimits, 'hardLimit' | 'maxBytes'>
  context: UploadContext
  metaOptions: { withMeta: boolean, multiple: boolean, emptyMeta: EmptyMeta }
  onAllUploaded: () => void
  /** Receives pending images that failed. */
  onSomeFailed: (failed: PendingImage[]) => void
}

/**
 * Uploads pending images in chunks and reports the outcome.
 */
export const useBatchUpload = ({
  pendingImages,
  uploadFn,
  setUrl,
  optimizeImageForUpload,
  compression,
  limits,
  context,
  metaOptions,
  onAllUploaded,
  onSomeFailed,
}: UseBatchUploadOptions) => {
  const messages = useAdminKitMessages()
  const { notify } = useNotify()
  const [isUploading, setIsUploading] = useState(false)

  const { hardLimit, maxBytes } = limits
  const { type, folder, createUniqueName } = context
  const { withMeta, multiple, emptyMeta } = metaOptions

  useLoading(isUploading)

  const submit = useCallback(async () => {
    if (!pendingImages.length || isUploading) return

    setIsUploading(true)
    const failed: PendingImage[] = []
    let successCount = 0
    const totalCount = pendingImages.length

    const reportUploaded = (succeededItems: UploadedImage[]) => {
      for (const succeeded of succeededItems) {
        setUrl(toUploadedImagePayload(succeeded))
        successCount += 1
      }
    }

    const uploadChunk = async (chunk: PendingImage[]) => {
      const metas = chunk.map((item) => buildUploadMeta(item, {
        withMeta,
        createUniqueName,
        multiple,
        compression,
        emptyMeta,
      }))

      try {
        const result = normalizeUploadResult(await uploadFn({
          files: chunk.map((item) => item.file),
          metas,
          context: { type, folder, createUniqueName },
        }))

        reportUploaded(result.succeeded)
        failed.push(...getFailedClientItems(chunk, result.failed))

        for (const failedItem of result.failed) {
          if (failedItem?.message) {
            notify('error', failedItem.message)
          }
        }
      } catch (err) {
        const { data } = (err ?? {}) as UploadErrorLike
        const errorFailed = Array.isArray(data?.failed) ? data.failed : null

        if (errorFailed?.length) {
          failed.push(...getFailedClientItems(chunk, errorFailed))
          reportUploaded(Array.isArray(data?.succeeded) ? data.succeeded : [])
        } else {
          failed.push(...chunk)
        }

        notify('error', getAddImagesErrorMessage(err))
      }
    }

    try {
      const prepared: PendingImage[] = []

      for (const item of pendingImages) {
        const file = compression === COMPRESSION_CLIENT
          ? await optimizeImageForUpload(item.file, { skipCompression: item.skipCompression })
          : item.file

        prepared.push({ ...item, file })
      }

      const chunks = chunkFilesByCountAndBytes(prepared, {
        maxCount: hardLimit,
        maxBytes,
        getSize: (item) => item.file?.size ?? 0,
      })

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
        if (chunks.length > 1) {
          notify('info', formatMessage(messages.upload.chunkUploadProgress, {
            chunkIndex: chunkIndex + 1,
            chunkTotal: chunks.length,
          }))
        }

        await uploadChunk(chunks[chunkIndex] ?? [])
      }
    } catch (err) {
      if (!failed.length) {
        failed.push(...pendingImages)
      }

      notify('error', getAddImagesErrorMessage(err))
    } finally {
      setIsUploading(false)
    }

    if (!failed.length) {
      // Close before success notify so toast/redux updates cannot re-open the modal.
      onAllUploaded()
      notify('success', totalCount === 1
        ? messages.upload.singleUploadSuccess
        : formatMessage(messages.upload.multiUploadSuccess, { totalCount }))
      return
    }

    onSomeFailed(failed)

    if (successCount > 0) {
      notify('warning', formatMessage(messages.upload.partialUploadSuccess, {
        successCount,
        totalCount,
      }))
    }
  }, [
    compression,
    createUniqueName,
    emptyMeta,
    folder,
    hardLimit,
    isUploading,
    maxBytes,
    messages.upload.chunkUploadProgress,
    messages.upload.multiUploadSuccess,
    messages.upload.partialUploadSuccess,
    messages.upload.singleUploadSuccess,
    multiple,
    notify,
    onAllUploaded,
    onSomeFailed,
    optimizeImageForUpload,
    pendingImages,
    setUrl,
    type,
    uploadFn,
    withMeta,
  ])

  return { isUploading, submit }
}
