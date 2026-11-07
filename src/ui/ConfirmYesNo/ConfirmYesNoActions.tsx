import type { MouseEvent } from 'react'
import { Button, Stack } from '@mui/material'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface ConfirmYesNoActionsProps {
  onNo: (event?: MouseEvent<HTMLElement>) => void
  onYes: (event?: MouseEvent<HTMLElement>) => void
  size?: 'small' | 'medium' | 'large'
  yesDisabled?: boolean
  noLabel?: string
  yesLabel?: string
}

/**
 * Shared No / Yes actions: No = red text, Yes = contained primary button.
 */
export const ConfirmYesNoActions = ({
  onNo,
  onYes,
  size = 'small',
  yesDisabled = false,
  noLabel,
  yesLabel,
}: ConfirmYesNoActionsProps) => {
  const messages = useAdminKitMessages()

  return (
    <Stack direction='row' spacing={2} width='100%' justifyContent='flex-end' alignItems='center'>
      <Button size={size} color='error' onClick={onNo}>
        {noLabel ?? messages.common.no}
      </Button>
      <Button
        size={size}
        variant='contained'
        disabled={yesDisabled}
        onClick={onYes}
      >
        {yesLabel ?? messages.common.yes}
      </Button>
    </Stack>
  )
}
