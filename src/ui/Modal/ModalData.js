import React from 'react'

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
 * @typedef {import('@mui/material').DialogProps & IModal} ModalDataState
 */

/**
 * @typedef {Object} IModalData
 * @property {{
 *   modalData: ModalDataState
 * }} states - all states for modal.
 * @property {Function} setModalData - Func for set ModalData.
 * @property {Function} closeModal - Func for close modal.
 */

/**
 * Context for Modal.
 * @type {React.Context<IModalData>}
 */
export const ModalData = React.createContext({
  states: {},
  setModalData: () => {},
  closeModal: () => {},
})