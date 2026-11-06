import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * @typedef {object} IProps
 * @property {boolean} [showCounter] - The status of showing counter.
 * @property {string} value - The value.
 * @property {number} effectiveMaxLength - The limit of text.
 * @property {boolean} [isOnClear] - The onClear status.
 */

/**
 * Counter component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The Counter components.
 */
export const Counter = ({ showCounter = true, value, effectiveMaxLength, isOnClear }) => {
  const progress = showCounter
    ? Math.min((value.length / effectiveMaxLength) * 100, 100)
    : 0
  const isLimit = showCounter && value.length >= effectiveMaxLength

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: isOnClear ? 0.5 : 0,
      }}
    >
      <CircularProgress
        variant='determinate'
        value={progress}
        size={32}
        thickness={4}
        sx={{
          color: isLimit ? 'error.main' : 'primary.main',
        }}
      />
      <Typography
        variant='caption'
        sx={{
          position: 'absolute',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          color: isLimit ? 'error.main' : 'text.primary',
        }}
      >
        {effectiveMaxLength - value.length}
      </Typography>
    </Box>
  )
}

Counter.propTypes = {
  showCounter: PropTypes.bool,
  value: PropTypes.string.isRequired,
  effectiveMaxLength: PropTypes.number.isRequired,
  isOnClear: PropTypes.bool,
}
