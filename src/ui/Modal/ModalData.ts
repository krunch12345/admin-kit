import { createContext } from 'react'
import type { ReactNode } from 'react'
import type { DialogProps } from '@mui/material'

export type ModalOwnerId = string | number

export interface ModalContent {
  /** The modal content. */
  children?: ReactNode
  /** The title in header. */
  title?: ReactNode
  /** Show footer with actions or not. */
  isActions?: boolean
  /** Additional action buttons. */
  additionalButtons?: ReactNode
  /** Callback for cancel button. */
  onCancel?: () => void
  /** Callback for submit button. */
  onSubmit?: () => void
  /** Red background for submit button. */
  isRedSubmit?: boolean
  /** Text for submit button. */
  titleSubmit?: string
  /** Optional icon for the submit button; defaults to Check / DeleteForever. */
  submitStartIcon?: ReactNode
  disabledSubmit?: boolean
  notCloseAfterSubmit?: boolean
  shouldConfirmClose?: boolean
  closeConfirmMessage?: ReactNode
  fullHeight?: boolean
  headerExtra?: ReactNode
  /** Closes the modal; invoked by the close button and the cancel / submit actions. */
  onClose?: () => void
  /** Owner token for close/replace guards in ModalDataProvider. */
  ownerId?: ModalOwnerId | null
}

export type ModalDataState = Partial<Omit<DialogProps, keyof ModalContent | 'open'>> & ModalContent & {
  open?: boolean
}

export type ModalDataUpdater = ModalDataState | ((prev: ModalDataState) => ModalDataState)

export interface ModalDataContextValue {
  states: {
    modalData?: ModalDataState
  }
  setModalData: (updater: ModalDataUpdater) => void
  /**
   * Closes the modal. Pass `ownerId` to close only if that owner currently holds the modal;
   * omit to force-close.
   */
  closeModal: (ownerId?: ModalOwnerId | null) => void
}

export const ModalData = createContext<ModalDataContextValue>({
  states: {},
  setModalData: () => {},
  closeModal: () => {},
})
