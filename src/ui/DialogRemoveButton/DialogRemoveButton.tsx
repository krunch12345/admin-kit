import { useState, type MouseEvent, type ReactNode } from 'react'
import { IconButton } from '../IconButton/IconButton'
import { MdDeleteForever } from 'react-icons/md'
import { Button, MenuItem, Typography } from '@mui/material'
import { ConfirmPopper } from '../ConfirmYesNo/ConfirmPopper'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export type DialogRemoveButtonProps = {
  name?: string
  nameObject?: string
  onRemove: () => void
  isMenuItem?: boolean
  onClick?: (event: MouseEvent) => void
  confirmMessage?: string
  variant?: 'icon' | 'text'
  label?: string
  showIcon?: boolean
  requireConfirm?: boolean
  disabled?: boolean
}

export const DialogRemoveButton = ({
  name = '',
  nameObject = '',
  onRemove,
  isMenuItem = false,
  onClick,
  confirmMessage,
  variant = 'icon',
  label,
  showIcon = true,
  requireConfirm = true,
  disabled = false,
}: DialogRemoveButtonProps) => {
  const messages = useAdminKitMessages()
  const [anchorConfirmEl, setAnchorConfirmEl] = useState<Element | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const resolvedLabel = label ?? messages.dialogRemove.label

  const confirmationText = confirmMessage
    ?? formatMessage(messages.dialogRemove.confirmMessage, { nameObject, name }).trim()

  const handleTrigger = (e: MouseEvent) => {
    e.stopPropagation()
    onClick?.(e)

    if (!requireConfirm) {
      onRemove()
      return
    }

    setAnchorConfirmEl(e.currentTarget as Element)
    setOpenConfirm(true)
  }

  const handleConfirm = () => {
    setOpenConfirm(false)
    setAnchorConfirmEl(null)
    onRemove()
  }

  const handleCancel = () => {
    setOpenConfirm(false)
    setAnchorConfirmEl(null)
  }

  let trigger: ReactNode

  if (isMenuItem) {
    trigger = (
      <MenuItem disabled={disabled} onClick={handleTrigger}>
        <Typography color='error'>{resolvedLabel}</Typography>
      </MenuItem>
    )
  } else if (variant === 'text') {
    trigger = (
      <Button
        color='error'
        disabled={disabled}
        startIcon={showIcon ? <MdDeleteForever /> : undefined}
        onClick={handleTrigger}
      >
        {resolvedLabel}
      </Button>
    )
  } else {
    trigger = (
      <IconButton
        title={resolvedLabel}
        disabled={disabled}
        color='error'
        onClick={handleTrigger}
        icon={<MdDeleteForever />}
      />
    )
  }

  return (
    <>
      {trigger}
      <ConfirmPopper
        open={openConfirm}
        anchorEl={anchorConfirmEl}
        onConfirm={handleConfirm}
        onClose={handleCancel}
        message={confirmationText}
      />
    </>
  )
}
