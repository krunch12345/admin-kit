import { Button, Fab } from '@mui/material'
import { MdExposurePlus1 } from 'react-icons/md'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface Plus1ButtonProps {
  /** The mark for FAB element. */
  isFab: boolean
  /** The handle on click. */
  onClick: () => void
  /** The disabled status. */
  disabled?: boolean
}

/**
 * Plus1 button component.
 */
export const Plus1Button = ({ isFab, onClick, disabled }: Plus1ButtonProps) => {
  const messages = useAdminKitMessages()

  return !isFab ? (
    <Button
      type='button'
      size='small'
      color='primary'
      variant='contained'
      onClick={onClick}
      disabled={disabled}
      title={messages.plus1.title}
    >
      <MdExposurePlus1 size={25} />
    </Button>
  ) : (
    <Fab
      size='large'
      color='primary'
      sx={{ position: 'absolute', right: 25, top: 34 }}
      disabled={disabled}
      title={messages.plus1.title}
    >
      <MdExposurePlus1 size={25} onClick={onClick} />
    </Fab>
  )
}
