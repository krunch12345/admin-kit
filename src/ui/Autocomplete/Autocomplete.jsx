import { TextField, Autocomplete as MuiAutocomplete } from '@mui/material'
import PropTypes from 'prop-types'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

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
  const messages = useAdminKitMessages()

  return (
    <MuiAutocomplete
      size='small'
      loadingText={messages.autocomplete.loadingText}
      noOptionsText={!props.inputValue
        ? noOptionsText || messages.autocomplete.enterName
        : messages.autocomplete.nothingFound}
      clearText={messages.autocomplete.clearText}
      closeText={messages.autocomplete.closeText}
      openText={messages.autocomplete.openText}
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
