import type { AdminKitMessages } from './types'

export type DatePickersMessages = AdminKitMessages['datePickers']

export type PickerView = 'meridiem' | 'hours' | 'minutes' | 'seconds' | (string & {})

export interface MuiPickersLocaleText {
  okButtonLabel: string
  cancelButtonLabel: string
  todayButtonLabel: string
  clearButtonLabel: string
  nextMonth: string
  previousMonth: string
  selectViewText: (view: PickerView) => string
  datePickerToolbarTitle: string
  timePickerToolbarTitle: string
  dateTimePickerToolbarTitle: string
}

/**
 * Builds MUI X date/time picker `localeText` from admin-kit datePickers messages.
 */
export const toMuiLocaleText = (datePickers: DatePickersMessages): MuiPickersLocaleText => {
  const { selectView } = datePickers

  const selectViewText = (view: PickerView): string => {
    switch (view) {
      case 'meridiem':
        return selectView.meridiem
      case 'hours':
        return selectView.hours
      case 'minutes':
        return selectView.minutes
      case 'seconds':
        return selectView.seconds
      default:
        return selectView.default
    }
  }

  return {
    okButtonLabel: datePickers.okButtonLabel,
    cancelButtonLabel: datePickers.cancelButtonLabel,
    todayButtonLabel: datePickers.todayButtonLabel,
    clearButtonLabel: datePickers.clearButtonLabel,
    nextMonth: datePickers.nextMonth,
    previousMonth: datePickers.previousMonth,
    selectViewText,
    datePickerToolbarTitle: datePickers.datePickerToolbarTitle,
    timePickerToolbarTitle: datePickers.timePickerToolbarTitle,
    dateTimePickerToolbarTitle: datePickers.dateTimePickerToolbarTitle,
  }
}
