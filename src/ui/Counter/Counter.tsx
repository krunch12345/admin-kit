import { Box, CircularProgress, Typography } from '@mui/material'

export interface CounterProps {
  /** The status of showing counter. */
  showCounter?: boolean
  value: string
  /** The limit of text. */
  effectiveMaxLength: number
  /** The onClear status. */
  isOnClear?: boolean
}

/**
 * Counter component.
 */
export const Counter = ({ showCounter = true, value, effectiveMaxLength, isOnClear }: CounterProps) => {
  const progress = showCounter
    ? Math.min((value.length / effectiveMaxLength) * 100, 100)
    : 0
  const remaining = effectiveMaxLength - value.length
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
        aria-label={`${remaining} characters remaining`}
        sx={{
          color: isLimit ? 'error.main' : 'primary.main',
        }}
      />
      <Typography
        variant='caption'
        aria-hidden
        sx={{
          position: 'absolute',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          color: isLimit ? 'error.main' : 'text.primary',
        }}
      >
        {remaining}
      </Typography>
    </Box>
  )
}
