import { useCallback, useState } from 'react'
import type { MouseEvent } from 'react'
import { IconButton } from '../IconButton/IconButton'
import { MdDeleteForever } from 'react-icons/md'
import { red } from '@mui/material/colors'
import { filter } from 'lodash-es'
import { ConfirmPopper } from '../ConfirmYesNo/ConfirmPopper'
import { formatMessage } from '../../locale/formatMessage'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

type RemovableItem = Record<string, unknown>

export interface RemoveButtonProps<T extends RemovableItem = RemovableItem> {
  /** The array of elements. */
  data: T[]
  /** The handle on save new array of elements after removing. */
  setNewData: (data: T[]) => void
  /** The object or primitive to delete (for display in the dialog). */
  removeObject: T | string
  /** When set, removes the item at this index instead of matching by id. */
  removeIndex?: number
  /** The name of name field. */
  nameField?: string
  /** The name of id field. */
  idField?: string
}

/**
 * Remove button component.
 */
export const RemoveButton = <T extends RemovableItem = RemovableItem>({
  data,
  setNewData,
  removeObject,
  removeIndex,
  nameField = 'name',
  idField = 'id',
}: RemoveButtonProps<T>) => {
  const messages = useAdminKitMessages()
  const [anchorConfirmEl, setAnchorConfirmEl] = useState<HTMLElement | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const removeById = useCallback((id: unknown) => {
    const updatedData = filter(data, item => item[idField] !== id)
    setNewData(updatedData)
  }, [data, idField, setNewData])

  const removeByIndex = useCallback(() => {
    setNewData(data.filter((_, i) => i !== removeIndex))
  }, [data, removeIndex, setNewData])

  const displayName = typeof removeObject === 'string'
    ? removeObject
    : String(removeObject?.[nameField] ?? '')

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
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
            removeById(typeof removeObject === 'string' ? removeObject : removeObject[idField])
          }
        }}
      />
    </>
  )
}
