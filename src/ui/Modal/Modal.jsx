import { useCallback, useContext, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { ConfirmPopper } from '../ConfirmYesNo/ConfirmPopper.jsx'
import { ModalData } from './ModalData.js'

/**
 * Modal component.
 * @returns {React.ReactElement} The Modal component.
 */
export const Modal = () => {
  const { states } = useContext(ModalData)
  const { modalData } = states
  const [closeConfirmAnchorEl, setCloseConfirmAnchorEl] = useState(null)
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false)

  const {
    children,
    title,
    isActions,
    additionalButtons,
    onCancel,
    onSubmit,
    isRedSubmit,
    titleSubmit = 'Применить',
    disabledSubmit,
    notCloseAfterSubmit,
    shouldConfirmClose = false,
    closeConfirmMessage = 'Вы уверены, что хотите отменить?',
    fullHeight = false,
    headerExtra = null,
    ...restModalData
  } = modalData

  const {
    sx,
    disableEscapeKeyDown = true,
    fullWidth = true,
    onClose,
    PaperProps,
    ...dialogProps
  } = restModalData

  const {
    sx: paperSx,
    ...restPaperProps
  } = PaperProps || {}

  const handleRequestClose = useCallback((event) => {
    if (shouldConfirmClose) {
      setCloseConfirmAnchorEl(event?.currentTarget ?? null)
      setIsCloseConfirmOpen(true)
      return
    }

    onClose?.()
  }, [onClose, shouldConfirmClose])

  const handleConfirmClose = useCallback(() => {
    setIsCloseConfirmOpen(false)
    setCloseConfirmAnchorEl(null)
    onClose?.()
  }, [onClose])

  const handleCancelCloseConfirm = useCallback((event) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()
    setIsCloseConfirmOpen(false)
    setCloseConfirmAnchorEl(null)
  }, [])

  return (
    <>
      <Dialog
        {...dialogProps}
        disableEscapeKeyDown={disableEscapeKeyDown}
        fullWidth={fullWidth}
        onClose={(_e, reason) => {
          if (reason === 'backdropClick') {
            return
          }
          handleRequestClose()
        }}
        PaperProps={{
          ...restPaperProps,
          sx: {
            ...(fullHeight
              ? {
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
              }
              : null),
            ...paperSx,
          },
        }}
        sx={{ mx: 5, ...sx, m: 0, p: 0 }}
      >
        <DialogTitle
          sx={{
            p: 2,
            zIndex: 2,
            flexShrink: 0,
          }}
        >
          <Stack spacing={headerExtra ? 2 : 0}>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent={onClose ? 'space-between' : 'flex-start'}
            >
              <Typography variant='h4'>
                {title}
              </Typography>

              {!!onClose && (
                <IconButton
                  edge='end'
                  size='small'
                  onClick={handleRequestClose}
                  color='error'
                  title='Отменить и закрыть'
                >
                  <Close />
                </IconButton>
              )}
            </Stack>

            {!!headerExtra && headerExtra}
          </Stack>
        </DialogTitle>

        <DialogContent
          sx={fullHeight
            ? {
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }
            : undefined}
        >
          {children}
        </DialogContent>

        {isActions && (
          <DialogActions sx={{ p: 2, flexShrink: 0 }}>
            {additionalButtons}

            {onCancel && (
              <Button
                color='error'
                onClick={() => {
                  onCancel()
                  onClose && onClose()
                }}
              >
                Отменить
              </Button>
            )}

            {onSubmit && (
              <Button
                variant='contained'
                color={isRedSubmit ? 'error' : 'primary'}
                onClick={() => {
                  onSubmit()
                  !notCloseAfterSubmit && onClose && onClose()
                }}
                disabled={disabledSubmit}
              >
                {titleSubmit}
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>

      <ConfirmPopper
        open={isCloseConfirmOpen}
        anchorEl={closeConfirmAnchorEl}
        placement='bottom-end'
        message={closeConfirmMessage}
        onClose={handleCancelCloseConfirm}
        onConfirm={handleConfirmClose}
      />
    </>
  )
}
