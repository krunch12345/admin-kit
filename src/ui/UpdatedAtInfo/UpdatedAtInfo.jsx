import React, { useMemo } from 'react'
import { Typography, keyframes, Stack } from '@mui/material'
import PropTypes from 'prop-types'
import { formatStringISODate } from '../../utils/formatStringISODate.js'
import { grey } from '@mui/material/colors'
import { Update } from '@mui/icons-material'

const smoothPulseRed = keyframes`
  0% { color: #ff3d3d; }
  25% { color: #ff6e6e; }
  50% { color: #bdbdbd; }
  75% { color: #ff6e6e; }
  100% { color: #ff3d3d; }
`

const smoothPulseYellow = keyframes`
  0% { color: #ffd740; }
  25% { color: #ffe57f; }
  50% { color: #bdbdbd; }
  75% { color: #ffe57f; }
  100% { color: #ffd740; }
`

/**
 * @typedef {object} IProps
 * @property {Date} updatedAt - Date of update an object.
 */

/**
 * UpdateAt Info item component.
 * @type {React.FC<IProps>}
 * @returns {React.ReactElement} The UpdatedAtInfo component.
 */
export const UpdatedAtInfo = ({ updatedAt }) => {
  const defaultColor = grey[400]

  const now = new Date()
  const updatedAtDate = new Date(updatedAt)
  const diffTime = now - updatedAtDate
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  const animationStyle = useMemo(() => {
    if (diffDays <= 1) {
      return { animation: `${smoothPulseRed} 3s ease-in-out infinite` }
    } else if (diffDays > 1 && diffDays <= 3) {
      return { animation: `${smoothPulseYellow} 3s ease-in-out infinite` }
    } else {
      return {}
    }
  }, [diffDays])

  return (
    <Stack direction='row' alignItems='center' spacing={0.5}>
      <Update
        fontSize='small'
        sx={{
          color: defaultColor,
          ...animationStyle
        }}
      />

      <Typography
        variant='body2'
        color={defaultColor}
      >
        {formatStringISODate(updatedAt)}
      </Typography>
    </Stack>
  )
}

UpdatedAtInfo.propTypes = {
  updatedAt: PropTypes.object.isRequired,
}
