import { useContext, useId } from 'react'
import { Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import { Cancel, DeleteForever, Save } from '@mui/icons-material'
import { ConfirmYesNoActions } from '../ConfirmYesNo/ConfirmYesNoActions'
import { ModalData } from '../Modal/ModalData'
import { UnsavedChangesConfirmBody } from './UnsavedChangesConfirmBody'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface EditControlsProps {
  /** The handle cancel onClick. */
  cancelOnClick: () => void
  /** The handle remove onClick. */
  removeOnClick?: () => void
  /** The handle save onClick. */
  saveOnClick: () => void
  /** The name of object. */
  name: string
  /** The status of object. */
  isAddNew?: boolean
  /** The disabled status of save button. */
  disabledSave?: boolean
  /** The isn't edited status. */
  isNotEdited?: boolean
  /** The isn't required fields status. */
  isNotRequiredFields?: boolean
  /** Labels of fields that differ from baseline (cancel and save modals). */
  changedFieldLabels?: string[]
  /** Show delete-sync checkbox (regular maps). */
  showSyncPointDeletes?: boolean
  /** Checkbox value. */
  syncPointDeletes?: boolean
  onSyncPointDeletesChange?: (checked: boolean) => void
}

type EditControlsAction = 'cancel' | 'remove' | 'save'

/**
 * Edit buttons component.
 */
export const EditControls = ({
  cancelOnClick,
  removeOnClick,
  saveOnClick,
  name,
  isAddNew,
  disabledSave,
  isNotEdited,
  isNotRequiredFields,
  changedFieldLabels = [],
  showSyncPointDeletes = false,
  syncPointDeletes = false,
  onSyncPointDeletesChange,
}: EditControlsProps) => {
  const messages = useAdminKitMessages()
  const modalOwnerId = useId()
  const { setModalData, closeModal } = useContext(ModalData)

  const getTitle = (action: EditControlsAction) => {
    switch (action) {
      case 'cancel':
        return messages.editControls.actionCancel
      case 'remove':
        return messages.editControls.actionDelete
      case 'save':
        return messages.editControls.actionSave
    }
  }

  const onSubmit = (action: EditControlsAction) => {
    switch (action) {
      case 'cancel':
        cancelOnClick()
        break
      case 'remove':
        removeOnClick?.()
        break
      case 'save':
        saveOnClick()
        break
    }
    closeModal(modalOwnerId)
  }

  const onClick = (action: EditControlsAction) => {
    setModalData({
      open: true,
      ownerId: modalOwnerId,
      title: formatMessage(messages.editControls.confirmTitle, { action: getTitle(action) }),
      isActions: true,
      maxWidth: 'sm',
      children: action === 'cancel' || action === 'save'
        ? (
          <UnsavedChangesConfirmBody
            isAddNew={isAddNew}
            name={name}
            changedFieldLabels={changedFieldLabels}
            syncPointDeletesLabel={
              action === 'save' && showSyncPointDeletes
                ? (syncPointDeletes ? messages.common.yes : messages.common.no)
                : null
            }
          />
        )
        : (
          <Typography variant='overline' fontSize={14}>
            {isAddNew ? messages.common.creating : messages.common.editing} &frasl;&frasl; {name}
          </Typography>
        ),
      additionalButtons: (
        <ConfirmYesNoActions
          onNo={() => closeModal(modalOwnerId)}
          onYes={() => onSubmit(action)}
        />
      ),
    })
  }

  return (
    <Stack spacing={1} width='100%'>
      {isNotRequiredFields && (
        <Typography color={theme => theme.palette.warning.main} alignSelf='center'>
          {messages.editControls.warningRequiredFields}
        </Typography>
      )}

      {isNotEdited && (
        <Typography color={theme => theme.palette.warning.main} alignSelf='center'>
          {messages.editControls.warningNotEdited}
        </Typography>
      )}

      <Stack spacing={2} direction='row' width='100%' justifyContent='space-between' alignItems='center'>
        <Button
          onClick={() => onClick('cancel')}
          size='small'
          color='error'
          startIcon={<Cancel />}
        >
          {messages.common.cancel}
        </Button>

        <Stack direction='row' spacing={2} alignItems='center'>
          {showSyncPointDeletes && (
            <FormControlLabel
              label={messages.editControls.syncPointDeletes}
              control={
                <Checkbox
                  size='small'
                  checked={syncPointDeletes}
                  onChange={(_, checked) => onSyncPointDeletesChange?.(checked)}
                />
              }
            />
          )}

          {!isAddNew && removeOnClick && (
            <Button
              variant='contained'
              color='error'
              onClick={() => onClick('remove')}
              size='small'
              startIcon={<DeleteForever />}
            >
              {messages.common.delete}
            </Button>
          )}

          <Button
            variant='contained'
            color='success'
            onClick={() => onClick('save')}
            size='small'
            startIcon={<Save />}
            sx={{ color: theme => theme.palette.grey.A100 }}
            disabled={disabledSave}
          >
            {messages.common.save}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
