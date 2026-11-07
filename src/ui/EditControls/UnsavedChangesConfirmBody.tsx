import { Children } from 'react'
import { Stack, Typography } from '@mui/material'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface UnsavedChangesConfirmBodyProps {
  isAddNew?: boolean
  name: string
  changedFieldLabels?: string[]
  /** Localized yes/no label when point-delete sync is relevant. */
  syncPointDeletesLabel?: string | null
}

/**
 * Shared body for cancel / save / router-leave unsaved-changes confirm modals.
 */
export const UnsavedChangesConfirmBody = ({
  isAddNew,
  name,
  changedFieldLabels = [],
  syncPointDeletesLabel = null,
}: UnsavedChangesConfirmBodyProps) => {
  const messages = useAdminKitMessages()

  return (
    <Stack spacing={1.5}>
      <Typography variant='overline' fontSize={14}>
        {isAddNew ? messages.common.creating : messages.common.editing} &frasl;&frasl; {name}
      </Typography>

      {changedFieldLabels.length > 0 && (
        <Stack spacing={0.5}>
          <Typography variant='body2' color='text.secondary'>
            {messages.unsavedChanges.changedFields}
          </Typography>
          <Stack component='ul' spacing={0.25} sx={{ m: 0, pl: 2.5 }}>
            {Children.toArray(
              changedFieldLabels.map((label) => (
                <Typography component='li' variant='body2'>
                  {label}
                </Typography>
              ))
            )}
          </Stack>
        </Stack>
      )}

      {syncPointDeletesLabel !== null && (
        <Typography variant='body2' color='error.main'>
          {formatMessage(messages.unsavedChanges.syncPointDeletesLine, { syncPointDeletesLabel })}
        </Typography>
      )}
    </Stack>
  )
}
