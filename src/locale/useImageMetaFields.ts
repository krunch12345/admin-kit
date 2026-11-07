import { useMemo } from 'react'
import {
  COPYABLE_META_FIELDS,
  IMAGE_META_FIELDS,
} from '../ui/ImageMetaFields/imageMetaFieldsConfig'
import type {
  CopyableMetaField,
  ImageMetaFieldDefinition,
} from '../ui/ImageMetaFields/imageMetaFieldsConfig'
import { getAdminKitMessages } from './runtime'
import { useAdminKitMessages } from './useAdminKitMessages'
import type { AdminKitMessages } from './types'

export const getImageMetaFields = (messages: AdminKitMessages = getAdminKitMessages()): ImageMetaFieldDefinition[] => {
  const labels: Record<string, string | undefined> = messages.imageMeta

  return IMAGE_META_FIELDS.map((field) => ({
    ...field,
    label: labels[field.key] ?? field.label,
    enLabel: labels[`${field.key}EN`] ?? field.enLabel,
  }))
}

export const getCopyableMetaFields = (messages: AdminKitMessages = getAdminKitMessages()): CopyableMetaField[] => {
  const fields = getImageMetaFields(messages)

  return COPYABLE_META_FIELDS.map((copyable, index) => {
    const field = fields[index]
    const label = field?.label ?? copyable.label

    return {
      ...copyable,
      label,
      ruLabel: label,
      enLabel: field?.enLabel ?? copyable.enLabel,
    }
  })
}

/**
 * Image meta field catalog with labels from the active locale.
 */
export const useImageMetaFields = (): ImageMetaFieldDefinition[] => {
  const messages = useAdminKitMessages()
  return useMemo(() => getImageMetaFields(messages), [messages])
}

/**
 * Copyable meta fields with labels from the active locale.
 */
export const useCopyableMetaFields = (): CopyableMetaField[] => {
  const messages = useAdminKitMessages()
  return useMemo(() => getCopyableMetaFields(messages), [messages])
}
