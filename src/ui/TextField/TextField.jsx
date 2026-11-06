import React, { useCallback, useEffect, useState } from 'react'
import { IconButton, InputAdornment, TextField as MuiTextField } from '@mui/material'
import { debounce } from 'lodash-es'
import { Clear } from '@mui/icons-material'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IProps
 * @property {string} value - The value.
 * @property {function} onChange - The function for change value.
 * @property {number} [debounceMs] - The delay for onChange function.
 * @property {function(string)} [onClear] - The function for clear value.
 */

/**
 * Custom TextField component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The TextField components.
 */
export const TextField = ({ value, onChange, debounceMs = 0, onClear, ...props }) => {
  const [localValue, setLocalValue] = useState('')

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const debouncedOnChange = useCallback(
    (newValue) => {
      debounce(() => {
        onChange(newValue)
      }, debounceMs)()
    },
    [onChange, debounceMs]
  )

  const handleChange = e => {
    const newValue = e.target.value
    setLocalValue(newValue)
    debouncedOnChange(newValue)
  }

  return (
    <MuiTextField
      size='small'
      value={localValue}
      onChange={handleChange}
      InputProps={{
        endAdornment: !!onClear && localValue && (
          <InputAdornment position='end'>
            <IconButton
              sx={{ maxHeight: 30, maxWidth: 30 }}
              onClick={() => {
                onClear()
                setLocalValue('')
              }}
            >
              <Clear fontSize='small' />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  )
}

TextField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  debounceMs: PropTypes.number,
  onClear: PropTypes.func,
}
