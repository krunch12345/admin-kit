import { useCallback, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { Image } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { IconButton } from '../IconButton/IconButton'
import { showAlert } from '../Alert/showAlertSlice'
import { copyImageToClipboard } from '../../utils/copyImageToClipboard'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface CopyImageButtonProps {
  /** Image URL to copy to the clipboard. */
  url: string
  /** Loaded thumbnail element. */
  imgRef?: RefObject<HTMLImageElement | null>
  /** Tooltip title before copy. */
  title?: string
  /** Button icon. */
  icon?: ReactNode
}

/**
 * Copies an image to the clipboard with success/error feedback.
 */
export const CopyImageButton = ({
  url,
  imgRef,
  title,
  icon = <Image />,
}: CopyImageButtonProps) => {
  const messages = useAdminKitMessages()
  const [isCopied, setIsCopied] = useState(false)
  const dispatch = useDispatch()

  const handleCopy = useCallback(() => {
    Promise.resolve(
      copyImageToClipboard({
        url,
        imgElement: imgRef?.current,
      })
    )
      .then(() => {
        setIsCopied(true)
        dispatch(showAlert({
          isShowAlert: true,
          severity: 'success',
          message: messages.copyImageButton.success,
        }))
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch(() => {
        dispatch(showAlert({
          isShowAlert: true,
          severity: 'error',
          message: messages.copyImageButton.error,
        }))
      })
  }, [dispatch, imgRef, messages.copyImageButton.error, messages.copyImageButton.success, url])

  return (
    <IconButton
      title={isCopied ? messages.copyImageButton.copied : title ?? messages.copyImageButton.title}
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
