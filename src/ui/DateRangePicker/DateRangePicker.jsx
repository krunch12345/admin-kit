import React from 'react'
import { DatePicker } from '../DatePicker/DatePicker.jsx'
import { endOfDay } from 'date-fns'
import { onChangeEndDate } from './onChangeEndDate.js'
import PropTypes from 'prop-types'

/**
 * DateRangePicker component
 * @param {object} props - Component props
 * @param {object} props.filters - Filters object with startDate and endDate properties
 * @param {function} props.setFilters - Function to update filters object
 * @param {string} [props.startLabel="Начало периода"] - Label for start date picker
 * @param {string} [props.endLabel="Конец периода"] - Label for end date picker
 * @param {boolean} [props.fullWidth=true] - Whether to make date pickers full width
 * @param {boolean} [props.allowFuture=true] - Whether to allow selecting future dates
 * @param {boolean} [props.hideClearButton] - Whether to hide clear button for date pickers
 * @returns {JSX.Element} - Rendered DateRangePicker component
 */
export const DateRangePicker = ({
  filters,
  setFilters,
  startLabel = 'Начало периода',
  endLabel = 'Конец периода',
  fullWidth = true,
  allowFuture = true,
  hideClearButton,
}) => {
  return (
    <>
      <DatePicker
        label={startLabel}
        value={filters?.startDate ?? null}
        onChange={(newDate, error) => {
          if (!error.validationError) {
            setFilters({ ...filters, startDate: newDate })
          }
        }}
        maxDate={allowFuture ? filters?.endDate : endOfDay(new Date())}
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
        label={endLabel}
        value={filters?.endDate ?? null}
        onChange={(newDate, error) => {
          if (!error.validationError) {
            onChangeEndDate(
              newDate,
              setFilters,
              filters,
              allowFuture
            )
          }
        }}
        clearDate={
          !hideClearButton
            ? () => {
              setFilters({ ...filters, endDate: null })
            }
            : null
        }
        maxDate={allowFuture ? null : endOfDay(new Date())}
        fullWidth={fullWidth}
        sx={{ m: 1, flex: 1, minWidth: '15.5rem' }}
      />
    </>
  )
}

DateRangePicker.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  fullWidth: PropTypes.bool,
  allowFuture: PropTypes.bool,
  hideClearButton: PropTypes.bool,
}
