import React, { useCallback, useState } from 'react'
import { ModalData } from './ModalData.js'
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
 */

/**
 * @typedef {import('@mui/material').DialogProps & IModal} ModalData
 */

/**
 * @typedef {object} IProps
 * @property {ReactNode} children - The content for wrapper.
 */

/**
 * Modal Data Provider component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The context provider for modal.
 */
export const ModalDataProvider = ({ children }) => {
  /**
   * @type {[ModalData, React.Dispatch<React.SetStateAction<ModalData>>]}
   */
  const [ modalData, setModalData ] = useState({
    open: false,
  })

  const closeModal = useCallback(() => {
    setModalData({
      open: false,
    })
  }, [])

  return (
    <ModalData.Provider
      value={{
        states: {
          modalData
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
