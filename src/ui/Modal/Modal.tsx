import { useCallback, useContext, useEffect, useState } from 'react'
import type { MouseEvent, SyntheticEvent } from 'react'
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
import { Cancel, Check, Close, DeleteForever } from '@mui/icons-material'
import { ConfirmPopper } from '../ConfirmYesNo/ConfirmPopper'
import { ModalData } from './ModalData'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

/**
 * Modal component.
 */
export const Modal = () => {
  const messages = useAdminKitMessages()
  const { states } = useContext(ModalData)
  const { modalData } = states
  const [closeConfirmAnchorEl, setCloseConfirmAnchorEl] = useState<HTMLElement | null>(null)
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false)
  const isDialogOpen = Boolean(modalData?.open)

  useEffect(() => {
    if (isDialogOpen) return

    setIsCloseConfirmOpen(false)
    setCloseConfirmAnchorEl(null)
  }, [isDialogOpen])

  const {
    children,
    title,
    isActions,
    additionalButtons,
    onCancel,
    onSubmit,
    isRedSubmit,
    titleSubmit,
    submitStartIcon,
    disabledSubmit,
    notCloseAfterSubmit,
    shouldConfirmClose = false,
    closeConfirmMessage,
    fullHeight = false,
    headerExtra = null,
    ownerId: _ownerId,
    ...restModalData
  } = modalData ?? {}

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

  const handleRequestClose = useCallback((event?: MouseEvent<HTMLElement>) => {
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

  const handleCancelCloseConfirm = useCallback((event?: SyntheticEvent | Event) => {
    event?.preventDefault()
    event?.stopPropagation()
    setIsCloseConfirmOpen(false)
    setCloseConfirmAnchorEl(null)
  }, [])

  return (
    <>
      <Dialog
        {...dialogProps}
        disableEscapeKeyDown={disableEscapeKeyDown}
        fullWidth={fullWidth}
        open={isDialogOpen}
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
              <Typography variant='h4' component='span'>
                {title}
              </Typography>

              {!!onClose && (
                <IconButton
                  edge='end'
                  size='small'
                  onClick={handleRequestClose}
                  color='error'
                  title={messages.modal.closeButtonTitle}
                >
                  <Close />
                </IconButton>
              )}
            </Stack>

            {!!headerExtra && headerExtra}
          </Stack>
        </DialogTitle>

        <DialogContent
          // Scrollable regions need a tab stop for keyboard access (WCAG 2.1.1).
          tabIndex={0}
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
                startIcon={<Cancel />}
                onClick={() => {
                  onCancel()
                  onClose && onClose()
                }}
              >
                {messages.modal.cancelButton}
              </Button>
            )}

            {onSubmit && (
              <Button
                variant='contained'
                color={isRedSubmit ? 'error' : 'primary'}
                startIcon={submitStartIcon ?? (isRedSubmit ? <DeleteForever /> : <Check />)}
                onClick={() => {
                  onSubmit()
                  !notCloseAfterSubmit && onClose && onClose()
                }}
                disabled={disabledSubmit}
              >
                {titleSubmit ?? messages.modal.titleSubmit}
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>

      <ConfirmPopper
        open={isCloseConfirmOpen && isDialogOpen}
        anchorEl={closeConfirmAnchorEl}
        placement='bottom-end'
        message={closeConfirmMessage ?? messages.modal.closeConfirmMessage}
        onClose={handleCancelCloseConfirm}
        onConfirm={handleConfirmClose}
      />
    </>
  )
}
