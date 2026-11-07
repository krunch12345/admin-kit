import type { ReactNode, SyntheticEvent } from 'react'
import {
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material'
import type { PopperProps } from '@mui/material'
import { ConfirmYesNoActions } from './ConfirmYesNoActions'

export interface ConfirmPopperProps {
  open: boolean
  anchorEl?: PopperProps['anchorEl']
  onClose: (event?: SyntheticEvent | Event) => void
  onConfirm: (event?: SyntheticEvent) => void
  message: ReactNode
  placement?: PopperProps['placement']
}

/**
 * Shared confirmation popper with message and No / Yes actions.
 */
export const ConfirmPopper = ({
  open,
  anchorEl,
  onClose,
  onConfirm,
  message,
  placement = 'bottom',
}: ConfirmPopperProps) => {
  const handleClose = (event?: SyntheticEvent) => {
    event?.preventDefault()
    event?.stopPropagation()
    onClose(event)
  }

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
      <ClickAwayListener
        onClickAway={(event) => {
          if (anchorEl instanceof Element && event.target instanceof Node && anchorEl.contains(event.target)) {
            return
          }
          onClose(event)
        }}
      >
        <Fade in={open} timeout={350}>
          <Stack component={Paper} p={2} spacing={2} elevation={4}>
            {typeof message === 'string' ? (
              <Typography>{message}</Typography>
            ) : message}

            <ConfirmYesNoActions
              onNo={handleClose}
              onYes={(event) => {
                event?.preventDefault()
                event?.stopPropagation()
                onConfirm(event)
                onClose(event)
              }}
            />
          </Stack>
        </Fade>
      </ClickAwayListener>
    </Popper>
  )
}
