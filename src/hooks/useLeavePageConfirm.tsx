import { useCallback, useContext, useEffect, useId, useRef } from 'react'
import { useBlocker } from 'react-router-dom'
import type { Blocker } from 'react-router-dom'
import { ConfirmYesNoActions } from '../ui/ConfirmYesNo/ConfirmYesNoActions'
import { ModalData } from '../ui/Modal/ModalData'
import { UnsavedChangesConfirmBody } from '../ui/EditControls/UnsavedChangesConfirmBody'
import { formatMessage } from '../locale/formatMessage'
import { useAdminKitMessages } from '../locale/useAdminKitMessages'

export interface UseLeavePageConfirmParams {
  /** Called when the user confirms leave (e.g. clearDraft). */
  onConfirmLeave?: () => void
  /** Alias of `onConfirmLeave` kept for backward compatibility. */
  clearDraft?: () => void
  isAddNew: boolean
  name: string
  changedFieldLabels?: string[]
}

export interface UseLeavePageConfirmResult {
  allowLeave: () => void
}

/**
 * Blocks any in-app leave from an edit page and asks the same confirm as Cancel.
 * Also warns on tab close / refresh via beforeunload.
 */
export const useLeavePageConfirm = ({
  onConfirmLeave,
  clearDraft,
  isAddNew,
  name,
  changedFieldLabels = [],
}: UseLeavePageConfirmParams): UseLeavePageConfirmResult => {
  const messages = useAdminKitMessages()
  const modalOwnerId = useId()
  const { setModalData, closeModal } = useContext(ModalData)
  const allowLeaveRef = useRef(false)
  const onConfirmLeaveRef = useRef(onConfirmLeave || clearDraft || (() => {}))
  const isAddNewRef = useRef(isAddNew)
  const nameRef = useRef(name)
  const changedFieldLabelsRef = useRef<string[]>(changedFieldLabels)
  const blockerRef = useRef<Blocker | null>(null)

  onConfirmLeaveRef.current = onConfirmLeave || clearDraft || (() => {})
  isAddNewRef.current = isAddNew
  nameRef.current = name
  changedFieldLabelsRef.current = changedFieldLabels

  const allowLeave = useCallback(() => {
    allowLeaveRef.current = true
  }, [])

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (allowLeaveRef.current) {
      return false
    }

    return currentLocation.pathname !== nextLocation.pathname
      || currentLocation.search !== nextLocation.search
  })

  blockerRef.current = blocker

  useEffect(() => {
    if (blocker.state !== 'blocked') {
      return
    }

    setModalData({
      open: true,
      ownerId: modalOwnerId,
      title: formatMessage(messages.editControls.confirmTitle, {
        action: messages.editControls.actionCancel,
      }),
      isActions: true,
      maxWidth: 'sm',
      children: (
        <UnsavedChangesConfirmBody
          isAddNew={isAddNewRef.current}
          name={nameRef.current}
          changedFieldLabels={changedFieldLabelsRef.current}
        />
      ),
      additionalButtons: (
        <ConfirmYesNoActions
          onNo={() => {
            closeModal(modalOwnerId)
            blockerRef.current?.reset?.()
          }}
          onYes={() => {
            onConfirmLeaveRef.current()
            closeModal(modalOwnerId)
            blockerRef.current?.proceed?.()
          }}
        />
      ),
    })
  }, [
    blocker.state,
    closeModal,
    messages.editControls.actionCancel,
    messages.editControls.confirmTitle,
    modalOwnerId,
    setModalData,
  ])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) {
        return
      }

      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return { allowLeave }
}
