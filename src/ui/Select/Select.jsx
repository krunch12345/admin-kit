import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material'
import { Clear } from '@mui/icons-material'
import PropTypes from 'prop-types'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

/**
 * @typedef {object} IProps
 * @property {string} id - The id.
 * @property {string} label - The label.
 * @property {string} value - The value.
 * @property {boolean} [required] - The required status.
 * @property {boolean} [hideAllItem] - The status of hiding the "All" item.
 * @property {boolean} [disabled] - The status of disabled select.
 * @property {function} setValue - The change value func.
 * @property {React.ReactNode} children - The options.
 * @property {Object} props - Other props by MuiSelect.
 */

/**
 * Select component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} Custom Select component.
 */
export const Select = ({ id, label, value, setValue, children, required, hideAllItem, disabled }) => {
  const m = useAdminKitMessages()

  return (
    <FormControl
      sx={{ display: 'flex', flex: 1, m: 1, minWidth: '10rem' }}
      required={required}
    >
      <InputLabel id={`select-${id}`} size='small'>
        {label}
      </InputLabel>
      <MuiSelect
        size='small'
        value={value}
        label={label}
        labelId='select-periodsOfTimeId'
        onChange={e => setValue(e.target.value)}
        endAdornment={
          !!value && (
            <InputAdornment position='end'>
              <IconButton
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
        {!hideAllItem && <MenuItem value={''} sx={{ fontStyle: 'italic' }}>{m.select.all}</MenuItem>}

        {children}
      </MuiSelect>
    </FormControl>
  )
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  required: PropTypes.bool,
  hideAllItem: PropTypes.bool,
  disabled: PropTypes.bool,
}
