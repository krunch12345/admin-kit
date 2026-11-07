import { useCallback, useEffect, useRef, useState } from 'react'
import { COPYABLE_META_FIELDS } from '../../ImageMetaFields/imageMetaFieldsConfig'
import { useNotify } from '../../../hooks/useNotify'
import { isAllowedImageFile } from '../../../utils/isAllowedImageFile'
import { formatMessage } from '../../../locale/formatMessage'
import { useAdminKitMessages } from '../../../locale/useAdminKitMessages'
import { DEFAULT_SERVER_COMPRESSION_MODE } from '../constants'
import { createPendingImageId, readFileAsDataUrl } from '../uploadHelpers'
import type {
  CopyFieldsParams,
  EmptyMeta,
  PendingImage,
  PendingImagePatch,
} from '../types'

const isUnsafeImageFile = (file: File): boolean => {
  const mimeType = String(file.type || '').toLowerCase()

  return mimeType.startsWith('image/') && !isAllowedImageFile(file)
}

export interface UseUploadQueueOptions {
  /** Default file name of a new pending image. */
  name?: string
  /** Default meta fields of a pending image. */
  emptyMeta: EmptyMeta
  multiple: boolean
  pendingLimit: number
}

/**
 * Pending images state: adding (with limits and validation alerts), editing and removing.
 */
export const useUploadQueue = ({ name, emptyMeta, multiple, pendingLimit }: UseUploadQueueOptions) => {
  const messages = useAdminKitMessages()
  const { notify } = useNotify()
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const pendingCountRef = useRef(0)

  useEffect(() => {
    pendingCountRef.current = pendingImages.length
  }, [pendingImages.length])

  const updatePendingImage = useCallback((id: string, partial: PendingImagePatch) => {
    setPendingImages((prev) => prev.map((item) => (
      item.id === id ? { ...item, ...partial } : item
    )))
  }, [])

  const applyBulkUpdate = useCallback((ids: string[], partial: PendingImagePatch) => {
    const idSet = new Set(ids)

    setPendingImages((prev) => prev.map((item) => (
      idSet.has(item.id) ? { ...item, ...partial } : item
    )))
  }, [])

  const copyFields = useCallback(({ sourceId, targetIds, fieldKeys }: CopyFieldsParams) => {
    const targetSet = new Set(targetIds)
    const fields = COPYABLE_META_FIELDS.filter((field) => fieldKeys.includes(field.key))

    setPendingImages((prev) => {
      const source = prev.find((item) => item.id === sourceId)

      if (!source) {
        return prev
      }

      const partial: PendingImagePatch = {}

      for (const field of fields) {
        partial[field.ruKey] = source[field.ruKey] ?? ''
        partial[field.enKey] = source[field.enKey] ?? ''
      }

      return prev.map((item) => (
        targetSet.has(item.id) ? { ...item, ...partial } : item
      ))
    })
  }, [])

  const removePendingImage = useCallback((id: string) => {
    setPendingImages((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const replacePendingImageFile = useCallback(async (id: string, file?: File | null) => {
    if (!file) return

    const imageSrc = await readFileAsDataUrl(file)

    updatePendingImage(id, { file, imageSrc })
  }, [updatePendingImage])

  const createPendingItems = useCallback((files: File[]): PendingImage[] => {
    const items = files.map((file): PendingImage => ({
      id: createPendingImageId(),
      file,
      imageSrc: '',
      fileName: name || '',
      skipCompression: false,
      compressionMode: DEFAULT_SERVER_COMPRESSION_MODE,
      ...emptyMeta,
    }))

    items.forEach(async ({ id, file }) => {
      const imageSrc = await readFileAsDataUrl(file)

      updatePendingImage(id, { imageSrc })
    })

    return items
  }, [emptyMeta, name, updatePendingImage])

  const addPendingFiles = useCallback((files: ArrayLike<File>) => {
    const candidates = Array.from(files).filter(Boolean)
    const imageFiles = candidates.filter(isAllowedImageFile)
    const blockedUnsafeCount = candidates.filter(isUnsafeImageFile).length

    if (!imageFiles.length) {
      notify('warning', messages.upload.unsupportedImageType)
      return
    }

    if (blockedUnsafeCount > 0) {
      notify('warning', formatMessage(messages.upload.skippedUnsafeImages, {
        count: blockedUnsafeCount,
      }))
    }

    if (!multiple) {
      const items = createPendingItems(imageFiles.slice(0, 1))

      pendingCountRef.current = items.length
      setPendingImages(items)
      return
    }

    const remaining = pendingLimit - pendingCountRef.current

    if (remaining <= 0) {
      notify('warning', formatMessage(messages.upload.pendingLimitReached, { pendingLimit }))
      return
    }

    const acceptedFiles = imageFiles.slice(0, remaining)

    if (acceptedFiles.length < imageFiles.length) {
      notify('warning', formatMessage(messages.upload.partialAddDueToLimit, {
        acceptedCount: acceptedFiles.length,
        totalSelected: imageFiles.length,
        pendingLimit,
      }))
    }

    const newItems = createPendingItems(acceptedFiles)

    pendingCountRef.current += newItems.length
    setPendingImages((prev) => [...prev, ...newItems])
  }, [
    createPendingItems,
    messages.upload.partialAddDueToLimit,
    messages.upload.pendingLimitReached,
    messages.upload.skippedUnsafeImages,
    messages.upload.unsupportedImageType,
    multiple,
    notify,
    pendingLimit,
  ])

  const addPendingFile = useCallback((file: File) => {
    addPendingFiles([file])
  }, [addPendingFiles])

  const clearPendingImages = useCallback(() => {
    setPendingImages([])
  }, [])

  return {
    pendingImages,
    setPendingImages,
    clearPendingImages,
    addPendingFile,
    addPendingFiles,
    updatePendingImage,
    applyBulkUpdate,
    copyFields,
    removePendingImage,
    replacePendingImageFile,
  }
}
