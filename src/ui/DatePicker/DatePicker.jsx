import React from 'react'
import {
  DatePicker as MuiDatePicker,
} from '@mui/x-date-pickers'
import { IconButton, InputAdornment } from '@mui/material'
import { Clear } from '@mui/icons-material'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IProps
 * @property {string} format - The format.
 * @property {function} clearDate - The clear date func.
 * @property {boolean} fullWidth - The full width status.
 * @property {Object} props - Other props by MuiAutocomplete.
 */

/**
 * Date picker component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} Date picker component.
 */
export const DatePicker = ({
  format = 'dd.MM.yyyy',
  clearDate,
  fullWidth,
  ...props
}) => {
  return (
    <MuiDatePicker
      format={format}
      slotProps={{
        inputAdornment: {
          position: 'start',
        },
        textField: {
          fullWidth,
          size: 'small',
          InputProps: props.value && clearDate && {
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    clearDate()
                  }}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          },
        },
        actionBar: {
          actions: ['clear', 'accept'],
        },
      }}
      {...props}
    />
  )
}

DatePicker.propTypes = {
  format: PropTypes.string,
  clearDate: PropTypes.func,
  fullWidth: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
}
