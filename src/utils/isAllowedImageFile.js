const UNSAFE_IMAGE_TYPES = new Set([
  'image/svg+xml',
  'image/svg',
])

/**
 * Client-side allowlist for image uploads.
 * MIME is advisory only — backends must still verify magic bytes.
 * @param {File|Blob|{ type?: string }|null|undefined} file
 * @returns {boolean}
 */
export const isAllowedImageFile = (file) => {
  const type = String(file?.type || '').toLowerCase()

  if (!type.startsWith('image/')) {
    return false
  }

  return !UNSAFE_IMAGE_TYPES.has(type)
}
