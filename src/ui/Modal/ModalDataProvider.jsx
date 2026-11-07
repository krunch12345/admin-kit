import React, { useCallback, useRef, useState } from 'react'
import { ModalData } from './ModalData.js'
import { canCloseModal, canReplaceModal } from './modalOwnership.js'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IModal
 * @property {ReactNode} [children] - The modal content.
 * @property {string} [title] - The title in header.
 * @property {boolean} [isActions] - Show footer with actions or not.
 * @property {ReactNode} [additionalButtons] - Additional action buttons.
 * @property {function} [onCancel] - Callback for cancel button.
 * @property {function} [onSubmit] - Callback for submit button.
 * @property {boolean} [isRedSubmit] - Red background for submit button.
 * @property {string} [titleSubmit] - Text for submit button.
 * @property {string|number} [ownerId] - Optional owner token; closeModal(ownerId) is ignored when it does not match.
 */

/**
 * @typedef {import('@mui/material').DialogProps & IModal} ModalData
 */

/**
 * @typedef {object} IProps
 * @property {ReactNode} children - The content for wrapper.
 */

/**
 * Resolves the next modal state from a setState updater.
 * @param {ModalData | ((prev: ModalData) => ModalData)} updater
 * @param {ModalData} prev
 * @returns {ModalData}
 */
const resolveModalData = (updater, prev) => (
  typeof updater === 'function' ? updater(prev) : updater
)

/**
 * Modal Data Provider component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The context provider for modal.
 */
export const ModalDataProvider = ({ children }) => {
  /**
   * @type {[ModalData, React.Dispatch<React.SetStateAction<ModalData>>]}
   */
  const [modalData, setModalDataState] = useState({
    open: false,
  })
  const ownerIdRef = useRef(null)

  const setModalData = useCallback((updater) => {
    setModalDataState((prev) => {
      const next = resolveModalData(updater, prev) || { open: false }

      if (!canReplaceModal(prev, next)) {
        return prev
      }

      if (next.open) {
        if (next.ownerId !== null) {
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
   * @param {string|number} [ownerId]
   */
  const closeModal = useCallback((ownerId) => {
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

  return (
    <ModalData.Provider
      value={{
        states: {
          modalData,
        },
        setModalData,
        closeModal,
      }}
    >
      {children}
    </ModalData.Provider>
  )
}

ModalDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
