import React, { Children } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IProps
 * @property {number} value
 * @property {function} setValue
 * @property {Array[string]} menuItems
 * @property {string} label
 */

/**
 * Is Boolean select component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Is Boolean select component.
 */
export const IsBooleanSelect = ({ value, setValue, menuItems, label }) => (
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
      onChange={e => setValue(e.target.value)}
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

IsBooleanSelect.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
}
