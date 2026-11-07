import { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import { ConfirmYesNoActions } from '../ConfirmYesNo/ConfirmYesNoActions.jsx'
import { ModalData } from '../Modal/ModalData.js'
import { UnsavedChangesConfirmBody } from './UnsavedChangesConfirmBody.jsx'
import { formatMessage } from '../../locale/formatMessage.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {function} cancelOnClick - The handle cancel onClick.
 * @property {function} [removeOnClick] - The handle remove onClick.
 * @property {function} saveOnClick - The handle save onClick.
 * @property {string} name - The name of object.
 * @property {boolean} [isAddNew] - The status of object.
 * @property {boolean} [disabledSave] - The disabled status of save button.
 * @property {boolean} [isNotEdited] - The isn't edited status.
 * @property {boolean} [isNotRequiredFields] - The isn't required fields status.
 * @property {string[]} [changedFieldLabels] - Labels of fields that differ from baseline (cancel and save modals).
 * @property {boolean} [showSyncPointDeletes] - Show delete-sync checkbox (regular maps).
 * @property {boolean} [syncPointDeletes] - Checkbox value.
 * @property {function(boolean): void} [onSyncPointDeletesChange]
 */

/**
 * Edit buttons component.
 * @param {IProps} props
 * @returns {React.ReactElement} The Edit buttons component.
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
}) => {
  const messages = useAdminKitMessages()
  const { setModalData, closeModal } = useContext(ModalData)

  const getTitle = (action) => {
    switch (action) {
    case 'cancel':
      return messages.editControls.actionCancel
    case 'remove':
      return messages.editControls.actionDelete
    case 'save':
      return messages.editControls.actionSave
    }
  }

  const onSubmit = (action) => {
    switch (action) {
    case 'cancel':
      cancelOnClick()
      break
    case 'remove':
      removeOnClick()
      break
    case 'save':
      saveOnClick()
      break
    }
    closeModal()
  }

  const onClick = (action) => {
    setModalData({
      open: true,
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
          onNo={closeModal}
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
            >
              {messages.common.delete}
            </Button>
          )}

          <Button
            variant='contained'
            color='success'
            onClick={() => onClick('save')}
            size='small'
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

EditControls.propTypes = {
  cancelOnClick: PropTypes.func.isRequired,
  removeOnClick: PropTypes.func,
  saveOnClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isAddNew: PropTypes.bool,
  disabledSave: PropTypes.bool,
  isNotEdited: PropTypes.bool,
  isNotRequiredFields: PropTypes.bool,
  changedFieldLabels: PropTypes.arrayOf(PropTypes.string),
  showSyncPointDeletes: PropTypes.bool,
  syncPointDeletes: PropTypes.bool,
  onSyncPointDeletesChange: PropTypes.func,
}
