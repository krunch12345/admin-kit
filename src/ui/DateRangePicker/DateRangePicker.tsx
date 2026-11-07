import { endOfDay } from 'date-fns'
import { DatePicker } from '../DatePicker/DatePicker'
import { onChangeEndDate } from './onChangeEndDate'
import type { DateRangeFilters } from './onChangeEndDate'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface DateRangePickerProps<T extends DateRangeFilters = DateRangeFilters> {
  /** Filters object with startDate and endDate properties. */
  filters: T
  /** Function to update filters object. */
  setFilters: (filters: T) => void
  /** Label for start date picker. */
  startLabel?: string
  /** Label for end date picker. */
  endLabel?: string
  /** Whether to make date pickers full width. */
  fullWidth?: boolean
  /** Whether to allow selecting future dates. */
  allowFuture?: boolean
  /** Whether to hide clear button for date pickers. */
  hideClearButton?: boolean
}

/**
 * DateRangePicker component
 */
export const DateRangePicker = <T extends DateRangeFilters = DateRangeFilters>({
  filters,
  setFilters,
  startLabel,
  endLabel,
  fullWidth = true,
  allowFuture = true,
  hideClearButton,
}: DateRangePickerProps<T>) => {
  const messages = useAdminKitMessages()

  return (
    <>
      <DatePicker
        label={startLabel ?? messages.dateRangePicker.startLabel}
        value={filters?.startDate ?? null}
        onChange={(newDate, error) => {
          if (!error.validationError) {
            setFilters({ ...filters, startDate: newDate })
          }
        }}
        maxDate={allowFuture ? filters?.endDate ?? undefined : endOfDay(new Date())}
        clearDate={
          !hideClearButton
            ? () => {
              setFilters({ ...filters, startDate: null })
            }
            : null
        }
        fullWidth={fullWidth}
        sx={{ m: 1, flex: 1, minWidth: '15.5rem' }}
      />
      <DatePicker
        label={endLabel ?? messages.dateRangePicker.endLabel}
        value={filters?.endDate ?? null}
        onChange={(newDate, error) => {
          if (error.validationError) {
            return
          }

          if (!newDate) {
            setFilters({ ...filters, endDate: null })
            return
          }

          onChangeEndDate(
            newDate,
            setFilters,
            filters,
            allowFuture
          )
        }}
        clearDate={
          !hideClearButton
            ? () => {
              setFilters({ ...filters, endDate: null })
            }
            : null
        }
        maxDate={allowFuture ? undefined : endOfDay(new Date())}
        fullWidth={fullWidth}
        sx={{ m: 1, flex: 1, minWidth: '15.5rem' }}
      />
    </>
  )
}
