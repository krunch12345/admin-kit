import React, { Children } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { red, yellow } from '@mui/material/colors'
import { FaCircle } from 'react-icons/fa'
import { Update } from '@mui/icons-material'

/**
 * @typedef {object} IProps
 * @property {string} [warning] - The warning description.
 * @property {string} [error] - The error description.
 * @property {boolean} [showUpdatedAt=true] - Whether to show updatedAt freshness legend.
 */

/**
 * Color Legend component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement|null} The legend of colors component.
 */
export const ColorLegend = ({ warning, error, showUpdatedAt = true }) => {
  if (!warning && !error && !showUpdatedAt) {
    return null
  }

  return (
    <Typography
      color={theme => theme.palette.grey[600]}
      fontSize={11}
      sx={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', width: '100%', flexWrap: 'wrap', gap: 1 }}
    >
      {Children.toArray([
        warning && (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <FaCircle
              color={yellow[700]}
              size={7}
            />&nbsp;— {warning}
          </span>
        ),
        error && (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <FaCircle
              color={red[500]}
              size={7}
            />&nbsp;— {error}
          </span>
        ),
        showUpdatedAt && (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Update
              fontSize='8'
              sx={{
                color: red[500],
              }}
            />&nbsp;—&nbsp;время обновления меньше 1 суток
          </span>
        ),
        showUpdatedAt && (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Update
              fontSize='8'
              sx={{
                color: yellow[500],
              }}
            />&nbsp;—&nbsp;время обновления меньше 3 суток
          </span>
        ),
      ])}
    </Typography>
  )
}

ColorLegend.propTypes = {
  warning: PropTypes.string,
  error: PropTypes.string,
  showUpdatedAt: PropTypes.bool,
}
