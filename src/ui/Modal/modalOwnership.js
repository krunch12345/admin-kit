/**
 * Pure helpers for singleton-modal ownership checks.
 * Used by ModalDataProvider and unit tests.
 */

/**
 * @param {string|number|null|undefined} currentOwnerId
 * @param {string|number|null|undefined} requestedOwnerId
 * @returns {boolean}
 */
export const canCloseModal = (currentOwnerId, requestedOwnerId) => {
  if (requestedOwnerId === null) {
    return true
  }

  if (currentOwnerId === null) {
    return true
  }

  return currentOwnerId === requestedOwnerId
}

/**
 * @param {{ open?: boolean, ownerId?: string|number|null }} prev
 * @param {{ open?: boolean, ownerId?: string|number|null }} next
 * @returns {boolean} Whether `next` may replace the currently open modal.
 */
export const canReplaceModal = (prev, next) => {
  if (!next?.open) {
    return true
  }

  if (!prev?.open) {
    return true
  }

  if (next.ownerId === null || prev.ownerId === null) {
    return true
  }

  return prev.ownerId === next.ownerId
}
