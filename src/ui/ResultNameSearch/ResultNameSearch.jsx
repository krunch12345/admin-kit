import React from 'react'
import { Accordion } from '../Accordion/Accordion.jsx'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'

/**
 * @typedef {object} IProps
 * @property {React.ReactNode} children - The Accordion details.
 * @property {number} [count] - Count of objects.
 * @property {boolean} [isErrorBackground] - Status of error.
 * @property {string} [summaryTitle] - Title of Accordion.
 */

/**
 * Result Name Search component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The ResultNameSearch components.
 */
export const ResultNameSearch = ({
  children,
  count,
  isErrorBackground,
  summaryTitle = 'Результат поиска по имени/названию'
}) => {
  return (
    <Accordion
      summaryTitle={summaryTitle}
      count={count}
      isErrorBackground={isErrorBackground}
    >
      {count > 0 ? children : <Typography>Совпадений не найдено</Typography>}
    </Accordion>
  )
}

ResultNameSearch.propTypes = {
  children: PropTypes.node.isRequired,
  count: PropTypes.number,
  isErrorBackground: PropTypes.bool,
  summaryTitle: PropTypes.string,
}
