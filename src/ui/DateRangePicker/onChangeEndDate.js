import { endOfDay, isAfter, isBefore } from 'date-fns'

/**
 * Checks if two dates have the same time.
 *
 * @param {Date} newDate The new date to compare.
 * @param {Date} oldDate The old date to compare.
 * @returns {boolean} True if the times are equal, false otherwise.
 */
const timeIsEqual = (newDate, oldDate) => {
  /**
   * Extracts the time from a date.
   *
   * @param {Date} date The date to extract the time from.
   * @returns {string} The time in the format 'HH:mm'.
   */
  const getOnlyTime = date =>
    date ? `${date.getHours()}:${date.getMinutes()}` : ''

  const newTime = getOnlyTime(newDate)
  const oldTime = getOnlyTime(oldDate)

  return newTime === oldTime
}

/**
 * Handles the change of the end date.
 *
 * @param {Date} newDate The new end date.
 * @param {Function} setFilters The function to set the filters.
 * @param {Object} filters The current filters.
 * @param {boolean} [allowFuture] Whether to allow future dates.
 */
export const onChangeEndDate = (
  newDate,
  setFilters,
  filters,
  allowFuture = false,
) => {
  if (allowFuture) {
    setFilters({
      ...filters,
      endDate: newDate,
    })
  } else {
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
}
