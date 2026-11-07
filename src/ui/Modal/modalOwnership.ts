/**
 * Pure helpers for singleton-modal ownership checks.
 * Used by ModalDataProvider and unit tests.
 */

type OwnerId = string | number | null | undefined

interface OwnedModalState {
  open?: boolean
  ownerId?: OwnerId
}

export const canCloseModal = (currentOwnerId: OwnerId, requestedOwnerId: OwnerId): boolean => {
  if (requestedOwnerId == null) {
    return true
  }

  if (currentOwnerId == null) {
    return true
  }

  return currentOwnerId === requestedOwnerId
}

/**
 * @returns Whether `next` may replace the currently open modal.
 */
export const canReplaceModal = (prev: OwnedModalState | null | undefined, next: OwnedModalState | null | undefined): boolean => {
  if (!next?.open) {
    return true
  }

  if (!prev?.open) {
    return true
  }

  if (next.ownerId == null || prev.ownerId == null) {
    return true
  }

  return prev.ownerId === next.ownerId
}
