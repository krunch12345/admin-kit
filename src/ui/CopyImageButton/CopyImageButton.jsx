import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Image } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { IconButton } from '../IconButton/IconButton.jsx'
import { showAlert } from '../Alert/showAlertSlice.js'
import { copyImageToClipboard } from '../../utils/copyImageToClipboard.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} CopyImageButtonProps
 * @property {string} url - Image URL to copy to the clipboard.
 * @property {React.RefObject<HTMLImageElement>} [imgRef] - Loaded thumbnail element.
 * @property {string} [title] - Tooltip title before copy.
 * @property {React.ReactNode} [icon] - Button icon.
 */

/**
 * Copies an image to the clipboard with success/error feedback.
 * @type {React.FC<CopyImageButtonProps>}
 */
export const CopyImageButton = ({
  url,
  imgRef,
  title,
  icon = <Image />,
}) => {
  const m = useAdminKitMessages()
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
          message: m.copyImageButton.success,
        }))
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch(() => {
        dispatch(showAlert({
          isShowAlert: true,
          severity: 'error',
          message: m.copyImageButton.error,
        }))
      })
  }, [dispatch, imgRef, m.copyImageButton.error, m.copyImageButton.success, url])

  return (
    <IconButton
      title={isCopied ? m.copyImageButton.copied : title ?? m.copyImageButton.title}
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

CopyImageButton.propTypes = {
  url: PropTypes.string.isRequired,
  imgRef: PropTypes.shape({ current: PropTypes.any }),
  title: PropTypes.string,
  icon: PropTypes.node,
}
