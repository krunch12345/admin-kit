import { useMemo } from 'react'
import {
  COPYABLE_META_FIELDS,
  IMAGE_META_FIELDS,
} from '../ui/ImageMetaFields/imageMetaFields.js'
import { getAdminKitMessages } from './runtime.js'
import { useAdminKitMessages } from './useAdminKitMessages.js'

/**
 * @param {import('./types.js').AdminKitMessages} messages
 * @returns {typeof IMAGE_META_FIELDS}
 */
export const getImageMetaFields = (messages = getAdminKitMessages()) => {
  const labels = messages.imageMeta
  return IMAGE_META_FIELDS.map((field) => ({
    ...field,
    label: labels[field.key] ?? field.label,
    enLabel: labels[`${field.key}EN`] ?? field.enLabel,
  }))
}

/**
 * @param {import('./types.js').AdminKitMessages} messages
 * @returns {typeof COPYABLE_META_FIELDS}
 */
export const getCopyableMetaFields = (messages = getAdminKitMessages()) => {
  const fields = getImageMetaFields(messages)
  return COPYABLE_META_FIELDS.map((copyable, index) => {
    const field = fields[index]
    return {
      ...copyable,
      label: field.label,
      ruLabel: field.label,
      enLabel: field.enLabel,
    }
  })
}

/**
 * Image meta field catalog with labels from the active locale.
 * @returns {typeof IMAGE_META_FIELDS}
 */
export const useImageMetaFields = () => {
  const messages = useAdminKitMessages()
  return useMemo(() => getImageMetaFields(messages), [messages])
}

/**
 * Copyable meta fields with labels from the active locale.
 * @returns {typeof COPYABLE_META_FIELDS}
 */
export const useCopyableMetaFields = () => {
  const messages = useAdminKitMessages()
  return useMemo(() => getCopyableMetaFields(messages), [messages])
}
