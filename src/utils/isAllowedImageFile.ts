const UNSAFE_IMAGE_TYPES = new Set([
  'image/svg+xml',
  'image/svg',
])

export interface MimeTypedFile {
  type?: string
}

/**
 * Client-side allowlist for image uploads.
 * MIME is advisory only — backends must still verify magic bytes.
 */
export const isAllowedImageFile = (file: File | Blob | MimeTypedFile | null | undefined): boolean => {
  const type = String(file?.type || '').toLowerCase()

  if (!type.startsWith('image/')) {
    return false
  }

  return !UNSAFE_IMAGE_TYPES.has(type)
}
