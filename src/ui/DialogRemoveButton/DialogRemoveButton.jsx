import { useState } from 'react'
import { IconButton } from '../IconButton/IconButton.jsx'
import { MdDeleteForever } from 'react-icons/md'
import PropTypes from 'prop-types'
import { Button, MenuItem, Typography } from '@mui/material'
import { ConfirmPopper } from '../ConfirmYesNo/ConfirmPopper.jsx'
import { formatMessage } from '../../locale/formatMessage.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {string} [name] - The name of object.
 * @property {string} [nameObject] - The name of object type.
 * @property {function} onRemove - The remove handler.
 * @property {boolean} [isMenuItem] - The status of menu item button.
 * @property {function} [onClick] - The onClick remove button.
 * @property {string} [confirmMessage] - Custom confirmation message.
 * @property {'icon' | 'text'} [variant] - Trigger button variant.
 * @property {string} [label] - Label for text variant trigger.
 * @property {boolean} [showIcon] - Show delete icon on text variant.
 * @property {boolean} [requireConfirm] - Ask for confirmation before calling onRemove.
 * @property {boolean} [disabled] - Disable the trigger button.
 */

/**
 * Dialog remove button component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Dialog remove button component.
 */
export const DialogRemoveButton = ({
  name = '',
  nameObject = '',
  onRemove,
  isMenuItem,
  onClick,
  confirmMessage,
  variant = 'icon',
  label,
  showIcon = true,
  requireConfirm = true,
  disabled = false,
}) => {
  const messages = useAdminKitMessages()
  const [anchorConfirmEl, setAnchorConfirmEl] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const resolvedLabel = label ?? messages.dialogRemove.label

  const confirmationText = confirmMessage
    ?? formatMessage(messages.dialogRemove.confirmMessage, { nameObject, name }).trim()

  const handleOnClick = (e) => {
    e.stopPropagation()

    if (disabled) {
      return
    }

    onClick?.()

    if (!requireConfirm) {
      onRemove()
      return
    }

    setAnchorConfirmEl(e.currentTarget)
    setOpenConfirm(true)
  }

  const renderTrigger = () => {
    if (isMenuItem) {
      return (
        <MenuItem onClick={handleOnClick} disabled={disabled}>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {showIcon && <MdDeleteForever />} {resolvedLabel}
          </Typography>
        </MenuItem>
      )
    }

    if (variant === 'text') {
      return (
        <Button
          variant='text'
          color='error'
          startIcon={showIcon ? <MdDeleteForever /> : undefined}
          onClick={handleOnClick}
          disabled={disabled}
        >
          {resolvedLabel}
        </Button>
      )
    }

    return (
      <IconButton
        icon={<MdDeleteForever />}
        title={formatMessage(messages.dialogRemove.title, { nameObject, name }).trim() || resolvedLabel}
        onClick={handleOnClick}
        color='error'
        disabled={disabled}
        sx={{
          ':hover': {
            color: 'error.dark',
          },
        }}
      />
    )
  }

  return (
    <>
      {renderTrigger()}

      <ConfirmPopper
        open={openConfirm}
        anchorEl={anchorConfirmEl}
        message={confirmationText}
        onClose={() => setOpenConfirm(false)}
        onConfirm={onRemove}
      />
    </>
  )
}

DialogRemoveButton.propTypes = {
  name: PropTypes.string,
  nameObject: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  isMenuItem: PropTypes.bool,
  onClick: PropTypes.func,
  confirmMessage: PropTypes.string,
  variant: PropTypes.oneOf(['icon', 'text']),
  label: PropTypes.string,
  showIcon: PropTypes.bool,
  requireConfirm: PropTypes.bool,
  disabled: PropTypes.bool,
}
