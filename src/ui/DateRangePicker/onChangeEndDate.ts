import { endOfDay, isAfter, isBefore } from 'date-fns'

export interface DateRangeFilters {
  startDate?: Date | null
  endDate?: Date | null
}

const getOnlyTime = (date?: Date | null): string => (
  date ? `${date.getHours()}:${date.getMinutes()}` : ''
)

const timeIsEqual = (newDate: Date, oldDate?: Date | null): boolean => (
  getOnlyTime(newDate) === getOnlyTime(oldDate)
)

/**
 * Handles the change of the end date.
 *
 * @param newDate The new end date.
 * @param setFilters The function to set the filters.
 * @param filters The current filters.
 * @param allowFuture Whether to allow future dates.
 */
export const onChangeEndDate = <T extends DateRangeFilters>(
  newDate: Date,
  setFilters: (filters: T) => void,
  filters: T,
  allowFuture = false,
): void => {
  if (allowFuture) {
    setFilters({
      ...filters,
      endDate: newDate,
    })
    return
  }

  let date = timeIsEqual(newDate, filters.endDate)
    ? endOfDay(newDate)
    : newDate

  if (isAfter(date, new Date())) {
    date = new Date()
  }

  if (
    filters.startDate &&
    isBefore(newDate, filters.startDate)
  ) {
    setFilters({
      ...filters,
      startDate: null,
      endDate: date,
    })
  } else {
    setFilters({
      ...filters,
      endDate: date,
    })
  }
}
