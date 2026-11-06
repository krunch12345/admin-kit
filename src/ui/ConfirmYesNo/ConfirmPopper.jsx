import PropTypes from 'prop-types'
import {
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material'
import { ConfirmYesNoActions } from './ConfirmYesNoActions.jsx'

/**
 * Shared confirmation popper with message and No / Yes actions.
 * @type {React.FC}
 */
export const ConfirmPopper = ({
  open,
  anchorEl,
  onClose,
  onConfirm,
  message,
  placement = 'bottom',
}) => {
  const handleClose = (event) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()
    onClose?.(event)
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
          if (anchorEl?.contains?.(event.target)) {
            return
          }
          onClose?.(event)
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
                event?.preventDefault?.()
                event?.stopPropagation?.()
                onConfirm?.(event)
                onClose?.(event)
              }}
            />
          </Stack>
        </Fade>
      </ClickAwayListener>
    </Popper>
  )
}

ConfirmPopper.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.node.isRequired,
  placement: PropTypes.string,
}
