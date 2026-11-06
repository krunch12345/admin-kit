/**
 * Builds MUI X date/time picker `localeText` from admin-kit datePickers messages.
 * @param {object} datePickers
 * @returns {object}
 */
export const toMuiLocaleText = (datePickers) => {
  const selectView = datePickers?.selectView || {}

  const selectViewText = (view) => {
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
