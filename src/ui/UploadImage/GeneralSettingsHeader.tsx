import { Button, Stack } from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'
import { DialogRemoveButton } from '../DialogRemoveButton/DialogRemoveButton'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import type { GeneralSettingsState } from './types'

export interface GeneralSettingsHeaderProps {
  generalSettings: GeneralSettingsState
}

/**
 * Modal header actions: open general settings and cancel them.
 */
export const GeneralSettingsHeader = ({ generalSettings }: GeneralSettingsHeaderProps) => {
  const messages = useAdminKitMessages()

  return (
    <Stack
      direction='row'
      spacing={2}
      alignItems='center'
      flexWrap='wrap'
      useFlexGap
      width='100%'
    >
      <Button
        variant='outlined'
        color='primary'
        startIcon={<SettingsIcon />}
        onClick={generalSettings.open}
        disabled={generalSettings.isOpen}
      >
        {messages.upload.generalSettings}
      </Button>

      {generalSettings.isOpen && (
        <DialogRemoveButton
          variant='text'
          label={messages.common.cancel}
          showIcon={false}
          requireConfirm={generalSettings.isDirty}
          confirmMessage={messages.upload.cancelConfirm}
          onRemove={generalSettings.close}
        />
      )}
    </Stack>
  )
}
