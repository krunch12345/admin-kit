import {
  DatePicker as MuiDatePicker,
} from '@mui/x-date-pickers'
import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers'
import { IconButton, InputAdornment } from '@mui/material'
import { Clear } from '@mui/icons-material'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export type DatePickerProps = MuiDatePickerProps<Date> & {
  /** The clear date func. */
  clearDate?: (() => void) | null
  /** The full width status. */
  fullWidth?: boolean
}

/**
 * Date picker component.
 */
export const DatePicker = ({
  format = 'dd.MM.yyyy',
  clearDate,
  fullWidth,
  ...props
}: DatePickerProps) => {
  const { datePickers } = useAdminKitMessages()

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
          InputProps: props.value && clearDate ? {
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label={datePickers.clearButtonLabel}
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
