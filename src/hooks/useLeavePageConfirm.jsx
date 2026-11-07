import { useCallback, useContext, useEffect, useId, useRef } from 'react'
import { useBlocker } from 'react-router-dom'
import { ConfirmYesNoActions } from '../ui/ConfirmYesNo/ConfirmYesNoActions.jsx'
import { ModalData } from '../ui/Modal/ModalData.js'
import { UnsavedChangesConfirmBody } from '../ui/EditControls/UnsavedChangesConfirmBody.jsx'
import { formatMessage } from '../locale/formatMessage.js'
import { useAdminKitMessages } from '../locale/useAdminKitMessages.js'

/**
 * Blocks any in-app leave from an edit page and asks the same confirm as Cancel.
 * Also warns on tab close / refresh via beforeunload.
 * @param {object} params
 * @param {() => void} [params.onConfirmLeave] - Called when the user confirms leave (e.g. clearDraft).
 * @param {boolean} params.isAddNew
 * @param {string} params.name
 * @param {string[]} [params.changedFieldLabels]
 * @returns {{ allowLeave: () => void }}
 */
export const useLeavePageConfirm = ({
  onConfirmLeave,
  clearDraft,
  isAddNew,
  name,
  changedFieldLabels = [],
}) => {
  const messages = useAdminKitMessages()
  const modalOwnerId = useId()
  const { setModalData, closeModal } = useContext(ModalData)
  const allowLeaveRef = useRef(false)
  const onConfirmLeaveRef = useRef(onConfirmLeave || clearDraft || (() => {}))
  const isAddNewRef = useRef(isAddNew)
  const nameRef = useRef(name)
  const changedFieldLabelsRef = useRef(changedFieldLabels)
  const blockerRef = useRef(null)

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
    const handleBeforeUnload = (event) => {
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
