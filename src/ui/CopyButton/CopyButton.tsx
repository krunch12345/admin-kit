import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { ContentCopy } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { IconButton } from '../IconButton/IconButton'
import { showAlert } from '../Alert/showAlertSlice'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface CopyButtonProps {
  /** Text to copy to the clipboard. */
  text: string
  /** Tooltip title before copy. */
  title?: string
  /** Button icon. */
  icon?: ReactNode
}

/**
 * Copies text to the clipboard with success/error feedback.
 */
export const CopyButton = ({ text, title, icon = <ContentCopy /> }: CopyButtonProps) => {
  const messages = useAdminKitMessages()
  const [isCopied, setIsCopied] = useState(false)
  const dispatch = useDispatch()

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'success',
        message: messages.copyButton.success,
      }))
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'error',
        message: messages.copyButton.error,
      }))
    }
  }, [dispatch, messages.copyButton.error, messages.copyButton.success, text])

  return (
    <IconButton
      title={isCopied ? messages.copyButton.copied : title ?? messages.copyButton.title}
      onClick={handleCopy}
      icon={icon}
      sx={isCopied ? {
        color: theme => theme.palette.success.main,
        '&:hover': {
          color: theme => theme.palette.success.dark,
        },
      } : {
        '&:hover': {
          color: theme => theme.palette.primary.main,
        },
      }}
    />
  )
}
