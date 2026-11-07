import { Children } from 'react'
import { Typography } from '@mui/material'
import { red, yellow } from '@mui/material/colors'
import { FaCircle } from 'react-icons/fa'
import { Update } from '@mui/icons-material'
import { useAdminKitMessages } from '../../locale/useAdminKitMessages'

export interface ColorLegendProps {
  /** The warning description. */
  warning?: string
  /** The error description. */
  error?: string
  /** Whether to show updatedAt freshness legend. */
  showUpdatedAt?: boolean
}

/**
 * Color Legend component.
 */
export const ColorLegend = ({ warning, error, showUpdatedAt = true }: ColorLegendProps) => {
  const messages = useAdminKitMessages()

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
              sx={{
                fontSize: 16,
                color: red[500],
              }}
            />&nbsp;—&nbsp;{messages.colorLegend.lessThan1Day}
          </span>
        ),
        showUpdatedAt && (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Update
              sx={{
                fontSize: 16,
                color: yellow[500],
              }}
            />&nbsp;—&nbsp;{messages.colorLegend.lessThan3Days}
          </span>
        ),
      ])}
    </Typography>
  )
}
