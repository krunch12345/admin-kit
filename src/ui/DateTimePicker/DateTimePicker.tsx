import {
  DateTimePicker as MuiDateTimePicker,
} from '@mui/x-date-pickers'
import type { DateTimePickerProps as MuiDateTimePickerProps } from '@mui/x-date-pickers'
import { IconButton, InputAdornment } from '@mui/material'
import { Clear } from '@mui/icons-material'

export type DateTimePickerProps = MuiDateTimePickerProps<Date> & {
  /** The clear date func. */
  clearDate?: (() => void) | null
  /** The full width status. */
  fullWidth?: boolean
}

/**
 * DateTime picker component.
 */
export const DateTimePicker = ({
  format = 'dd.MM.yyyy HH:mm',
  clearDate,
  fullWidth,
  ...props
}: DateTimePickerProps) => {
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
          InputProps: props.value && clearDate ? {
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
          } : undefined,
        },
        actionBar: {
          actions: ['clear', 'accept'],
        },
      }}
      {...props}
    />
  )
}
