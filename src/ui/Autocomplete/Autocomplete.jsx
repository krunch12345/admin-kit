import React from 'react'
import { TextField, Autocomplete as MuiAutocomplete } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IProps
 * @property {string} label - The label.
 * @property {string} [noOptionsText] - The no options text.
 * @property {function} [onInputKeyDown] - Key handler on the input (runs after Autocomplete internal handler).
 * @property {Object} props - Other props by MuiAutocomplete.
 */

/**
 * Autocomplete component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} Autocomplete component.
 */
export const Autocomplete = ({ label, noOptionsText, onInputKeyDown, ...props }) => {
  return (
    <MuiAutocomplete
      size='small'
      loadingText='Идет загрузка...'
      noOptionsText={!props.inputValue ? noOptionsText || 'Введите название' : 'Ничего не найдено'}
      clearText='Очистить'
      closeText='Закрыть'
      openText='Открыть'
      filterOptions={(options) => props.inputValue && options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onKeyDown={e => {
            params.onKeyDown?.(e)
            onInputKeyDown?.(e)
          }}
        />
      )}
      openOnFocus
      getOptionLabel={option => option?.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      sx={{ m: 1, flex: 1, minWidth: '15rem' }}
      {...props}
    />
  )
}

Autocomplete.propTypes = {
  props: PropTypes.object,
  label: PropTypes.string.isRequired,
  noOptionsText: PropTypes.string,
  inputValue: PropTypes.string,
  onInputKeyDown: PropTypes.func,
}
