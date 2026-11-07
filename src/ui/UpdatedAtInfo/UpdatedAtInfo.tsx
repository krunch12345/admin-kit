import { useMemo } from 'react'
import { Typography, keyframes, Stack } from '@mui/material'
import { formatStringISODate } from '../../utils/formatStringISODate'
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

export interface UpdatedAtInfoProps {
  /** ISO date string of the last update. */
  updatedAt: string
}

/**
 * UpdateAt Info item component.
 */
export const UpdatedAtInfo = ({ updatedAt }: UpdatedAtInfoProps) => {
  const defaultColor = grey[400]

  const now = new Date()
  const updatedAtDate = new Date(updatedAt)
  const diffTime = now.getTime() - updatedAtDate.getTime()
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
