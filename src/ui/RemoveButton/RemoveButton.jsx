import { useCallback, useState } from 'react'
import { IconButton } from '../IconButton/IconButton.jsx'
import { MdDeleteForever } from 'react-icons/md'
import { red } from '@mui/material/colors'
import { filter } from 'lodash-es'
import PropTypes from 'prop-types'
import { ConfirmPopper } from '../ConfirmYesNo/ConfirmPopper.jsx'
import { formatMessage } from '../../locale/formatMessage.js'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {Array} data - The array of elements.
 * @property {function} setNewData - The handle on save new array of elements after removing.
 * @property {Object|string} removeObject - The object or primitive to delete (for display in the dialog).
 * @property {number} [removeIndex] - When set, removes the item at this index instead of matching by id.
 * @property {string} [nameField] - The name of name field.
 * @property {string} [idField] - The name of id field.
 */

/**
 * Remove button component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Remove from list icon button component.
 */
export const RemoveButton = ({
  data,
  setNewData,
  removeObject,
  removeIndex,
  nameField = 'name',
  idField = 'id',
}) => {
  const messages = useAdminKitMessages()
  const [anchorConfirmEl, setAnchorConfirmEl] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const removeById = useCallback(id => {
    const updatedData = filter(data, item => item[idField] !== id)
    setNewData(updatedData)
  }, [data, idField, setNewData])

  const removeByIndex = useCallback(() => {
    setNewData(data.filter((_, i) => i !== removeIndex))
  }, [data, removeIndex, setNewData])

  const displayName = typeof removeObject === 'string'
    ? removeObject
    : (removeObject?.[nameField] ?? '')

  const handleOnClick = e => {
    setAnchorConfirmEl(e.currentTarget)
    setOpenConfirm(!openConfirm)
  }

  return (
    <>
      <IconButton
        title={formatMessage(messages.removeButton.title, { displayName })}
        onClick={handleOnClick}
        icon={<MdDeleteForever />}
        color={red.A400}
      />

      <ConfirmPopper
        open={openConfirm}
        anchorEl={anchorConfirmEl}
        message={formatMessage(messages.removeButton.confirmMessage, { displayName })}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          if (typeof removeIndex === 'number') {
            removeByIndex()
          } else {
            removeById(removeObject[idField])
          }
        }}
      />
    </>
  )
}

RemoveButton.propTypes = {
  data: PropTypes.array.isRequired,
  setNewData: PropTypes.func.isRequired,
  removeObject: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  removeIndex: PropTypes.number,
  nameField: PropTypes.string,
  idField: PropTypes.string,
}
