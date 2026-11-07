import type { ReactNode } from 'react'
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material'
import { Clear } from '@mui/icons-material'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'
import { fieldSxCompact } from '../fieldSx'

export interface SelectProps {
  id: string
  label: string
  value: string | number
  /** The required status. */
  required?: boolean
  /** The status of hiding the "All" item. */
  hideAllItem?: boolean
  /** The status of disabled select. */
  disabled?: boolean
  /** The change value func. */
  setValue: (value: string) => void
  /** The options. */
  children?: ReactNode
}

/**
 * Select component.
 */
export const Select = ({ id, label, value, setValue, children, required, hideAllItem, disabled }: SelectProps) => {
  const messages = useAdminKitMessages()

  const labelId = `select-${id}`

  return (
    <FormControl
      sx={fieldSxCompact}
      required={required}
    >
      <InputLabel id={labelId} size='small'>
        {label}
      </InputLabel>
      <MuiSelect
        size='small'
        value={value}
        label={label}
        labelId={labelId}
        onChange={e => setValue(e.target.value as string)}
        endAdornment={
          !!value && (
            <InputAdornment position='end'>
              <IconButton
                aria-label={messages.common.clear}
                sx={{ maxHeight: 30, maxWidth: 30, mr: 2 }}
                onClick={() => setValue('')}
              >
                <Clear fontSize='small' />
              </IconButton>
            </InputAdornment>
          )
        }
        disabled={disabled}
      >
        {!hideAllItem && <MenuItem value={''} sx={{ fontStyle: 'italic' }}>{messages.select.all}</MenuItem>}

        {children}
      </MuiSelect>
    </FormControl>
  )
}
