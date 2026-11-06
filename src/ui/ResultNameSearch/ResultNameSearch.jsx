import { Accordion } from '../Accordion/Accordion.jsx'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages.js'

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
  summaryTitle,
}) => {
  const m = useAdminKitMessages()

  return (
    <Accordion
      summaryTitle={summaryTitle ?? m.resultNameSearch.summaryTitle}
      count={count}
      isErrorBackground={isErrorBackground}
    >
      {count > 0 ? children : <Typography>{m.resultNameSearch.noMatches}</Typography>}
    </Accordion>
  )
}

ResultNameSearch.propTypes = {
  children: PropTypes.node.isRequired,
  count: PropTypes.number,
  isErrorBackground: PropTypes.bool,
  summaryTitle: PropTypes.string,
}
