import { Children } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export interface IsBooleanSelectProps {
  value: number | string
  setValue: (value: number) => void
  menuItems: string[]
  label: string
}

/**
 * Is Boolean select component.
 */
export const IsBooleanSelect = ({ value, setValue, menuItems, label }: IsBooleanSelectProps) => (
  <FormControl
    sx={{ display: 'flex', flex: 1, m: 1, minWidth: '15rem' }}
  >
    <InputLabel id='boolean-select' size='small'>
      {label}
    </InputLabel>
    <Select
      size='small'
      value={value}
      label={label}
      labelId='boolean-select'
      onChange={e => setValue(e.target.value as number)}
    >
      {Children.toArray(
        menuItems.map(
          (item, index) => (
            <MenuItem value={index}>{item}</MenuItem>
          )
        )
      )}
    </Select>
  </FormControl>
)
