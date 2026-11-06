const selectViewText = /** @param {import("@mui/x-date-pickers/internals/models").TimeViewWithMeridiem} view */
  view => {
    switch (view) {
    case 'meridiem': {
      return 'Выберите время суток'
    }

    case 'hours': {
      return 'Выберите час'
    }

    case 'minutes': {
      return 'Выберите минуты'
    }

    case 'seconds': {
      return 'Выберите секунды'
    }

    default:
      return 'Выберите время'
    }
  }

export const LOCALE_TEXT = {
  okButtonLabel: 'Ok',
  cancelButtonLabel: 'Отменить',
  todayButtonLabel: 'Сегодня',
  clearButtonLabel: 'Очистить',
  nextMonth: 'Следующий месяц',
  previousMonth: 'Предыдущий месяц',
  selectViewText,
  datePickerToolbarTitle: 'Выберите время',
  timePickerToolbarTitle: 'Выберите время',
  dateTimePickerToolbarTitle: 'Выберите время',
}
