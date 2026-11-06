import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { ContentCopy } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { IconButton } from '../IconButton/IconButton.jsx'
import { showAlert } from '../Alert/showAlertSlice.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {string} text - Text to copy to the clipboard.
 * @property {string} [title] - Tooltip title before copy.
 * @property {React.ReactNode} [icon] - Button icon.
 */

/**
 * Copies text to the clipboard with success/error feedback.
 * @type {React.FC<IProps>}
 */
export const CopyButton = ({ text, title, icon = <ContentCopy /> }) => {
  const m = useAdminKitMessages()
  const [isCopied, setIsCopied] = useState(false)
  const dispatch = useDispatch()

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'success',
        message: m.copyButton.success,
      }))
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      dispatch(showAlert({
        isShowAlert: true,
        severity: 'error',
        message: m.copyButton.error,
      }))
    }
  }, [dispatch, m.copyButton.error, m.copyButton.success, text])

  return (
    <IconButton
      title={isCopied ? m.copyButton.copied : title ?? m.copyButton.title}
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

CopyButton.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string,
  icon: PropTypes.node,
}
