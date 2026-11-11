import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ModalData } from './ModalData'
import type { ModalDataContextValue, ModalDataState, ModalDataUpdater, ModalOwnerId } from './ModalData'
import { canCloseModal, canReplaceModal } from './modalOwnership'

interface ModalDataProviderProps {
  children: ReactNode
}

const resolveModalData = (updater: ModalDataUpdater, prev: ModalDataState): ModalDataState => (
  typeof updater === 'function' ? updater(prev) : updater
)

/**
 * Modal Data Provider component.
 * @returns The context provider for modal.
 */
export const ModalDataProvider = ({ children }: ModalDataProviderProps) => {
  const [modalData, setModalDataState] = useState<ModalDataState>({
    open: false,
  })
  const ownerIdRef = useRef<ModalOwnerId | null>(null)

  const setModalData = useCallback((updater: ModalDataUpdater) => {
    setModalDataState((prev) => {
      const next = resolveModalData(updater, prev) || { open: false }

      if (!canReplaceModal(prev, next)) {
        return prev
      }

      if (next.open) {
        if (next.ownerId != null) {
          ownerIdRef.current = next.ownerId
        } else if (!prev.open) {
          ownerIdRef.current = null
        }
      } else {
        ownerIdRef.current = null
      }

      return next
    })
  }, [])

  /**
   * Closes the modal.
   * When `ownerId` is passed, the close is ignored if another owner currently holds the modal.
   * Call without args to force-close (confirm dialogs, navigation, etc.).
   */
  const closeModal = useCallback((ownerId?: ModalOwnerId | null) => {
    setModalDataState((prev) => {
      if (!prev.open) {
        return { open: false }
      }

      if (!canCloseModal(ownerIdRef.current, ownerId)) {
        return prev
      }

      ownerIdRef.current = null
      return { open: false }
    })
  }, [])

  const value = useMemo<ModalDataContextValue>(() => ({
    states: {
      modalData,
    },
    setModalData,
    closeModal,
  }), [modalData, setModalData, closeModal])

  return (
    <ModalData.Provider value={value}>
      {children}
    </ModalData.Provider>
  )
}
