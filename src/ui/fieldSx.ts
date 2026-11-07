import type { SxProps, Theme } from '@mui/material'

/** Shared min width for form fields across the kit. */
export const FIELD_MIN_WIDTH = '15rem'

/** Compact field min width (Select / boolean). */
export const FIELD_MIN_WIDTH_COMPACT = '10rem'

/** Default sx for flex-growing form fields. */
export const fieldSx: SxProps<Theme> = {
  display: 'flex',
  flex: 1,
  m: 1,
  minWidth: FIELD_MIN_WIDTH,
}

/** Compact variant for selects. */
export const fieldSxCompact: SxProps<Theme> = {
  display: 'flex',
  flex: 1,
  m: 1,
  minWidth: FIELD_MIN_WIDTH_COMPACT,
}
