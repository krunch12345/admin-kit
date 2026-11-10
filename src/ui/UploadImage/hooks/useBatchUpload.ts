import { useCallback, useRef, useState } from 'react'
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
 *
 * `submit` is referentially stable. Latest queue / callbacks are read from refs so the
 * Modal's stored `onSubmit` snapshot cannot call a stale `setUrl` or empty queue.
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

  const pendingImagesRef = useRef(pendingImages)
  const uploadFnRef = useRef(uploadFn)
  const setUrlRef = useRef(setUrl)
  const optimizeRef = useRef(optimizeImageForUpload)
  const onAllUploadedRef = useRef(onAllUploaded)
  const onSomeFailedRef = useRef(onSomeFailed)
  const compressionRef = useRef(compression)
  const limitsRef = useRef(limits)
  const contextRef = useRef(context)
  const metaOptionsRef = useRef(metaOptions)
  const messagesRef = useRef(messages)
  const notifyRef = useRef(notify)
  const isUploadingRef = useRef(false)

  pendingImagesRef.current = pendingImages
  uploadFnRef.current = uploadFn
  setUrlRef.current = setUrl
  optimizeRef.current = optimizeImageForUpload
  onAllUploadedRef.current = onAllUploaded
  onSomeFailedRef.current = onSomeFailed
  compressionRef.current = compression
  limitsRef.current = limits
  contextRef.current = context
  metaOptionsRef.current = metaOptions
  messagesRef.current = messages
  notifyRef.current = notify

  useLoading(isUploading)

  const submit = useCallback(async () => {
    const images = pendingImagesRef.current

    if (!images.length || isUploadingRef.current) {
      return
    }

    isUploadingRef.current = true
    setIsUploading(true)

    const failed: PendingImage[] = []
    let successCount = 0
    const totalCount = images.length
    const { hardLimit, maxBytes } = limitsRef.current
    const { type, folder, createUniqueName } = contextRef.current
    const { withMeta, multiple, emptyMeta } = metaOptionsRef.current
    const compressionMode = compressionRef.current
    const currentMessages = messagesRef.current
    const currentNotify = notifyRef.current

    const reportUploaded = (succeededItems: UploadedImage[]) => {
      for (const succeeded of succeededItems) {
        setUrlRef.current(toUploadedImagePayload(succeeded))
        successCount += 1
      }
    }

    const uploadChunk = async (chunk: PendingImage[]) => {
      const metas = chunk.map((item) => buildUploadMeta(item, {
        withMeta,
        createUniqueName,
        multiple,
        compression: compressionMode,
        emptyMeta,
      }))

      try {
        const result = normalizeUploadResult(await uploadFnRef.current({
          files: chunk.map((item) => item.file),
          metas,
          context: { type, folder, createUniqueName },
        }))

        reportUploaded(result.succeeded)
        failed.push(...getFailedClientItems(chunk, result.failed))

        for (const failedItem of result.failed) {
          if (failedItem?.message) {
            currentNotify('error', failedItem.message)
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

        currentNotify('error', getAddImagesErrorMessage(err))
      }
    }

    try {
      const prepared: PendingImage[] = []

      for (const item of images) {
        const file = compressionMode === COMPRESSION_CLIENT
          ? await optimizeRef.current(item.file, { skipCompression: item.skipCompression })
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
          currentNotify('info', formatMessage(currentMessages.upload.chunkUploadProgress, {
            chunkIndex: chunkIndex + 1,
            chunkTotal: chunks.length,
          }))
        }

        await uploadChunk(chunks[chunkIndex] ?? [])
      }
    } catch (err) {
      if (!failed.length) {
        failed.push(...images)
      }

      currentNotify('error', getAddImagesErrorMessage(err))
    } finally {
      isUploadingRef.current = false
      setIsUploading(false)
    }

    if (!failed.length && successCount > 0) {
      // Close before success notify so toast/redux updates cannot re-open the modal.
      onAllUploadedRef.current()
      currentNotify('success', totalCount === 1
        ? currentMessages.upload.singleUploadSuccess
        : formatMessage(currentMessages.upload.multiUploadSuccess, { totalCount }))
      return
    }

    if (failed.length) {
      onSomeFailedRef.current(failed)
    }

    if (successCount > 0) {
      currentNotify('warning', formatMessage(currentMessages.upload.partialUploadSuccess, {
        successCount,
        totalCount,
      }))
      return
    }

    if (!failed.length) {
      currentNotify('error', getAddImagesErrorMessage(undefined))
    }
  }, [])

  return { isUploading, submit }
}
