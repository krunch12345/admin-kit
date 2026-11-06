import React from 'react'
import {
  DateTimePicker as MuiDateTimePicker,
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
 * DateTime picker component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} DateTime picker component.
 */
export const DateTimePicker = ({
  format = 'dd.MM.yyyy HH:mm',
  clearDate,
  fullWidth,
  ...props
}) => {
  return (
    <MuiDateTimePicker
      ampm={false}
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

DateTimePicker.propTypes = {
  format: PropTypes.string,
  clearDate: PropTypes.func,
  fullWidth: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
}
